// src/seed/seed.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referente } from '../referente/entities/referente.entity';
import { Club } from '../clubes/entities/club.entity';
import { Role } from '../auth/roles.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Referente)
    private readonly referenteRepo: Repository<Referente>,
    @InjectRepository(Club)
    private readonly clubRepo: Repository<Club>,
  ) {}

  async onModuleInit() {
    await this.seedDatos();
  }

  async seedDatos() {
    this.logger.log('Iniciando carga de datos iniciales (Seed)...');

    // 1. Crear Club Administrativo (Necesario por la FK clubId)
    let clubAdmin = await this.clubRepo.findOne({ where: { nombre: 'Administración Liga' } });
    
    if (!clubAdmin) {
      clubAdmin = this.clubRepo.create({
        nombre: 'Administración Liga',
        categoria: 'masculino', // Valor dummy
        correo: 'admin@liga.com',
        telefono: '00000000',
        fechaRegistro: new Date().toISOString(),
        activo: true,
        localidadId: 1, // Asumiendo que existe localidad 1, sino ajusta este ID
      });
      await this.clubRepo.save(clubAdmin);
      this.logger.log('Club "Administración Liga" creado.');
    }

    // 2. Crear Presidenta
    const mailPresidenta = 'gashardo23@gmail.com';
    const existePresi = await this.referenteRepo.findOne({ where: { correo: mailPresidenta } });

    if (!existePresi) {
      const presidenta = this.referenteRepo.create({
        nombre: 'Presidenta',
        apellido: 'Admin',
        correo: mailPresidenta,
        telefono: '3541608632',
        password: 'admin123', // Contraseña Fija
        rol: Role.PRESIDENTA,
        club: clubAdmin,
      });
      await this.referenteRepo.save(presidenta); // El @BeforeInsert hasheará la pass
      this.logger.log(`Usuario PRESIDENTA creado: ${mailPresidenta} | Pass: admin123`);
    }

    // 3. Crear Tesorero
    const mailTesorero = 'jeremiasmaldonadoescuela@gmail.com';
    const existeTeso = await this.referenteRepo.findOne({ where: { correo: mailTesorero } });

    if (!existeTeso) {
      const tesorero = this.referenteRepo.create({
        nombre: 'Tesorero',
        apellido: 'Admin',
        correo: mailTesorero,
        telefono: '3515141992',
        password: 'tesorero123', // Contraseña Fija
        rol: Role.TESORERO,
        club: clubAdmin,
      });
      await this.referenteRepo.save(tesorero);
      this.logger.log(`Usuario TESORERO creado: ${mailTesorero} | Pass: tesorero123`);
    }
  }
}