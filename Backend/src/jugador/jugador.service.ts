import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { Jugador } from './entities/jugador.entity';

@Injectable()
export class JugadorService {
  constructor(
    @InjectRepository(Jugador)
    private readonly jugadorRepository: Repository<Jugador>,
  ) {}

  async create(createJugadorDto: CreateJugadorDto): Promise<Jugador> {
    const newJugador = this.jugadorRepository.create(createJugadorDto);
    const saved = await this.jugadorRepository.save(newJugador);
    // Volvemos a buscar para incluir la relación 'club'
    return this.findOne(saved.id);
  }

  findAll(): Promise<Jugador[]> {
    // Usamos 'relations' para traer los datos del club
    return this.jugadorRepository.find({
      relations: ['club'],
    });
  }

  async findOne(id: number): Promise<Jugador> {
    const jugador = await this.jugadorRepository.findOne({
      where: { id },
      relations: ['club'],
    });
    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado.`);
    }
    return jugador;
  }

  async update(
    id: number,
    updateJugadorDto: UpdateJugadorDto,
  ): Promise<Jugador> {
    const jugador = await this.jugadorRepository.preload({
      id,
      ...updateJugadorDto,
    });
    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado.`);
    }
    const saved = await this.jugadorRepository.save(jugador);
    // Volvemos a buscar para incluir la relación 'club'
    return this.findOne(saved.id);
  }

  async remove(id: number) {
    const result = await this.jugadorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado.`);
    }
    return { deleted: true, id };
  }
}