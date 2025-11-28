import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
  ) {}

  /**
   * Crea un nuevo registro de pago.
   */
  async create(createPagoDto: CreatePagoDto): Promise<Pago> {
    // Validar si el clubId existe podría hacerse aquí o con constraints/servicios
    // const clubExists = await this.clubRepository.findOneBy({ id: createPagoDto.clubId });
    // if (!clubExists) throw new NotFoundException('Club no encontrado');

    // Crea la entidad Pago a partir del DTO
    const nuevoPago = this.pagoRepository.create(createPagoDto);
    // Guarda la nueva entidad en la base de datos
    const savedPago = await this.pagoRepository.save(nuevoPago);
    // Devuelve el pago guardado, cargando la relación 'club' para la respuesta
    return this.findOne(savedPago.id);
  }

  /**
   * Obtiene todos los registros de pago, incluyendo la información del club asociado.
   */
  findAll(): Promise<Pago[]> {
    return this.pagoRepository.find({
      relations: ['club'], // Carga la entidad Club relacionada
      order: { fecha: 'DESC' }, // Ordena por fecha descendente (más recientes primero)
    });
  }

  /**
   * Obtiene un registro de pago específico por su ID, incluyendo el club.
   */
  async findOne(id: number): Promise<Pago> {
    const pago = await this.pagoRepository.findOne({
      where: { id },
      relations: ['club'], // Carga la entidad Club relacionada
    });
    // Si no se encuentra el pago, lanza una excepción
    if (!pago) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado.`);
    }
    return pago;
  }

  /**
   * Actualiza un registro de pago existente.
   */
  async update(id: number, updatePagoDto: UpdatePagoDto): Promise<Pago> {
    // 'preload' busca el pago por ID y fusiona los datos del DTO
    // No guarda automáticamente, solo prepara la entidad
    const pago = await this.pagoRepository.preload({
      id: id,
      ...updatePagoDto,
    });
    // Si preload devuelve undefined, el pago no existe
    if (!pago) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado.`);
    }
    // Guarda la entidad actualizada en la base de datos
    await this.pagoRepository.save(pago);
    // Devuelve el pago actualizado, recargando con la relación 'club'
    return this.findOne(id);
  }

  /**
   * Elimina permanentemente un registro de pago.
   */
  async remove(id: number): Promise<{ deleted: boolean; id: number }> {
    // Intenta eliminar el registro por ID
    const result = await this.pagoRepository.delete(id);
    // Si 'affected' es 0, no se eliminó ninguna fila (no se encontró)
    if (result.affected === 0) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado.`);
    }
    // Devuelve confirmación
    return { deleted: true, id };
  }

  // --- Opcional: Métodos Adicionales ---
  /**
   * Encuentra todos los pagos asociados a un club específico.
   */
  // async findAllByClub(clubId: number): Promise<Pago[]> {
  //   return this.pagoRepository.find({
  //     where: { clubId },
  //     relations: ['club'],
  //     order: { fecha: 'DESC' },
  //   });
  // }
}