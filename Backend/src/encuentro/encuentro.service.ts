import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEncuentroDto } from './dto/create-encuentro.dto';
import { Encuentro } from './entities/encuentro.entity';

@Injectable()
export class EncuentroService {
  constructor(
    @InjectRepository(Encuentro)
    private readonly encuentroRepository: Repository<Encuentro>,
  ) {}

  // Métodos básicos (findAll, findOne, update, remove)
  // Probablemente no necesites un 'create' público aquí,
  // ya que los encuentros se crearán junto con el fixture.

  findAllByFixture(fixtureId: number): Promise<Encuentro[]> {
    return this.encuentroRepository.find({
        where: { fixtureId },
        relations: ['club1', 'club2'] // Cargar clubes relacionados
    });
  }
}