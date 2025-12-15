import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referente } from './entities/referente.entity';
import { CreateReferenteDto } from './dto/create-referente.dto';
import { UpdateReferenteDto } from './dto/update-referente.dto';
import { MailService } from '../mail/mail.service'; // <--- 1. IMPORTAR

@Injectable()
export class ReferenteService {
  private readonly logger = new Logger(ReferenteService.name);

  constructor(
    @InjectRepository(Referente)
    private referenteRepository: Repository<Referente>,
    private mailService: MailService, // <--- 2. INYECTAR
  ) {}

  // --- Generador de Contraseña Aleatoria ---
  private generateRandomPassword(length: number = 8): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  // --- CREAR (Registro + Generación de Password + Email) ---
  async create(createReferenteDto: CreateReferenteDto) {
    // 1. Validar unicidad del correo
    const existing = await this.referenteRepository.findOne({ 
      where: { correo: createReferenteDto.correo } 
    });
    if (existing) {
      throw new BadRequestException('El correo ya está registrado.');
    }

    // 2. Generar contraseña temporal
    const tempPassword = this.generateRandomPassword(10);

    // 3. Crear instancia (el hash ocurre automáticamente en la Entidad con @BeforeInsert)
    const nuevoReferente = this.referenteRepository.create({
      ...createReferenteDto,
      password: tempPassword, 
    });

    // 4. Guardar en BD
    await this.referenteRepository.save(nuevoReferente);

    // 5. ENVIAR CORREO
    try {
      await this.mailService.enviarCredenciales(
        nuevoReferente.correo,
        tempPassword,
        nuevoReferente.nombre
      );
      this.logger.log(`Correo de credenciales enviado a ${nuevoReferente.correo}`);
    } catch (error) {
      this.logger.error(`Error enviando correo a ${nuevoReferente.correo}: ${error}`);
      // No lanzamos error para no revertir la creación del usuario,
      // la contraseña sigue siendo visible en la respuesta JSON como respaldo.
    }

    // 6. Retornar datos + contraseña plana (Respaldo visual para el admin)
    return {
      message: 'Referente creado. Se ha intentado enviar las credenciales por correo.',
      usuario: nuevoReferente.correo,
      tempPassword: tempPassword, 
      referente: {
        id: nuevoReferente.id,
        nombre: nuevoReferente.nombre,
        apellido: nuevoReferente.apellido,
        correo: nuevoReferente.correo,
        clubId: nuevoReferente.clubId
      }
    };
  }

  // --- Métodos Standard CRUD ---
  async findAll() {
    return this.referenteRepository.find({ relations: ['club'] });
  }

  async findOne(id: number) {
    const referente = await this.referenteRepository.findOne({ 
      where: { id },
      relations: ['club'] 
    });
    if (!referente) throw new NotFoundException(`Referente #${id} no encontrado`);
    return referente;
  }

  async update(id: number, updateReferenteDto: UpdateReferenteDto) {
    const referente = await this.referenteRepository.preload({
      id: id,
      ...updateReferenteDto,
    });
    if (!referente) throw new NotFoundException(`Referente #${id} no encontrado`);
    return this.referenteRepository.save(referente);
  }

  async remove(id: number) {
    const referente = await this.findOne(id);
    return this.referenteRepository.remove(referente);
  }

  // --- Métodos Específicos de AUTH ---

  // Busca usuario y TRAE el password (necesario para validar login)
  async findOneByEmailForAuth(correo: string): Promise<Referente | null> {
    return this.referenteRepository.findOne({ 
      where: { correo },
      // Importante: Incluir 'rol' para que funcione el sistema de permisos
      select: ['id', 'correo', 'password', 'nombre', 'apellido', 'clubId', 'rol'] 
    });
  }

  // Cambiar contraseña (para cuando el usuario quiera cambiar la aleatoria)
  async changePassword(id: number, newPass: string) {
    const referente = await this.referenteRepository.findOneBy({ id });
    if (!referente) throw new NotFoundException('Usuario no encontrado');

    referente.password = newPass; // La entidad lo hasheará automáticamente
    await this.referenteRepository.save(referente);
    
    return { message: 'Contraseña actualizada correctamente.' };
  }
}