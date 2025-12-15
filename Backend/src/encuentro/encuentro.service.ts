import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encuentro } from './entities/encuentro.entity';

@Injectable()
export class EncuentroService {
  constructor(
    @InjectRepository(Encuentro)
    private readonly encuentroRepository: Repository<Encuentro>,
  ) {}

  // Buscar todos por ID de Fixture
  async findAllByFixture(fixtureId: number): Promise<Encuentro[]> {
    return this.encuentroRepository.find({
      // Aseguramos que la consulta use la relación correcta
      where: { fixture: { id: fixtureId } }, 
      relations: ['club1', 'club2']
    });
  }

  // Buscar uno por ID (Necesario para validar antes de actualizar)
  async findOne(id: number): Promise<Encuentro> {
    const encuentro = await this.encuentroRepository.findOne({ 
      where: { id },
      relations: ['club1', 'club2']
    });
    if (!encuentro) {
      throw new NotFoundException(`Encuentro con ID ${id} no encontrado`);
    }
    return encuentro;
  }

  // --- MÉTODO FALTANTE QUE CAUSABA EL ERROR ---
  async update(id: number, data: any) {
    // 1. Buscamos si existe
    const encuentro = await this.findOne(id);

    // 2. Combinamos los datos nuevos con los existentes
    // Esto permite actualizar solo el resultado sin borrar lo demás
    this.encuentroRepository.merge(encuentro, data);

    // 3. Guardamos
    return this.encuentroRepository.save(encuentro);
  }

  // Eliminar (Opcional, pero útil tenerlo)
  async remove(id: number) {
    const encuentro = await this.findOne(id);
    return this.encuentroRepository.remove(encuentro);
  }
}