import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFixtureDto } from './dto/create-fixture.dto';
import { UpdateFixtureDto } from './dto/update-fixture.dto';
import { Fixture } from './entities/fixture.entity';
import { Encuentro } from '../encuentro/entities/encuentro.entity'; // Import Encuentro

@Injectable()
export class FixtureService {
  constructor(
    @InjectRepository(Fixture)
    private readonly fixtureRepository: Repository<Fixture>,
    @InjectRepository(Encuentro) // Inyectar repositorio de Encuentro
    private readonly encuentroRepository: Repository<Encuentro>,
  ) {}

  async create(createFixtureDto: CreateFixtureDto): Promise<Fixture> {
    const { partidos, ...fixtureData } = createFixtureDto;

    // 1. Crear el Fixture principal
    const newFixture = this.fixtureRepository.create(fixtureData);
    const savedFixture = await this.fixtureRepository.save(newFixture);

    // 2. Crear los Encuentros asociados
    if (partidos && partidos.length > 0) {
      const encuentrosEntities = partidos.map(encuentroDto =>
        this.encuentroRepository.create({
          ...encuentroDto,
          fixtureId: savedFixture.id, // Asignar el ID del fixture creado
        }),
      );
      await this.encuentroRepository.save(encuentrosEntities);
    }

    // 3. Devolver el fixture completo con sus partidos cargados
    return this.findOne(savedFixture.id);
  }

  findAll(): Promise<Fixture[]> {
    return this.fixtureRepository.find({
      relations: ['partidos', 'partidos.club1', 'partidos.club2'], // Cargar partidos y sus clubes
      order: { fecha: 'DESC' } // Ordenar por fecha, más reciente primero
    });
  }

  async findOne(id: number): Promise<Fixture> {
    const fixture = await this.fixtureRepository.findOne({
      where: { id },
      relations: ['partidos', 'partidos.club1', 'partidos.club2'], // Cargar partidos y sus clubes
    });
    if (!fixture) {
      throw new NotFoundException(`Fixture con ID ${id} no encontrado.`);
    }
    return fixture;
  }

  async update(id: number, updateFixtureDto: UpdateFixtureDto): Promise<Fixture> {
  // Manejar 'partidos' con un cast para evitar conflictos de tipos en tiempo de compilación
  const partidos = (updateFixtureDto as any).partidos;
  const fixtureData = { ...(updateFixtureDto as any) } as any;
  delete fixtureData.partidos;

     // Cargar y validar fixture existente
     const fixture = await this.fixtureRepository.preload({ id, ...fixtureData });
     if (!fixture) {
       throw new NotFoundException(`Fixture con ID ${id} no encontrado.`);
     }

     // Si no se enviaron partidos, solo actualizamos los datos del fixture
     if (!partidos) {
       await this.fixtureRepository.save(fixture);
       return this.findOne(id);
     }

     // Si vienen partidos, sincronizarlos: crear/actualizar/borrar según diff
     await this.encuentroRepository.manager.transaction(async (manager) => {
       // Obtener encuentros actuales del fixture
       const actuales: Encuentro[] = await manager.find(Encuentro, { where: { fixtureId: id } });
       const actualesIds = actuales.map((a) => a.id);

       // Ids entrantes (los que deben permanecer/actualizarse)
       const entrantesIds = (partidos as any[])
         .filter((p) => typeof p.id === 'number')
         .map((p) => p.id as number);

       // Borrar los encuentros que no están en la lista entrante
       const aBorrar = actualesIds.filter((aid) => !entrantesIds.includes(aid));
       if (aBorrar.length > 0) {
         await manager.delete(Encuentro, aBorrar);
       }

       // Procesar entrantes: actualizar los existentes o crear nuevos
       for (const p of partidos as any[]) {
         // Validación básica: evitar asignar un encuentro con id que no pertenezca al fixture
         if (p.id && !actualesIds.includes(p.id)) {
           throw new NotFoundException(`Encuentro con ID ${p.id} no pertenece al fixture ${id}.`);
         }

         const entidad = manager.create(Encuentro, {
           jornada: p.jornada,
           grupo: p.grupo,
           fecha: p.fecha,
           resultado: p.resultado || '-',
           fixtureId: id,
           club1Id: p.club1Id,
           club2Id: p.club2Id,
           id: p.id, // si existe, será usado para update
         });

         // Save a través del manager (insertará o actualizará según tenga id)
         await manager.save(Encuentro, entidad);
       }
     });

     // Finalmente, guardar datos del fixture y devolver el recurso actualizado
     await this.fixtureRepository.save(fixture);
     return this.findOne(id);
  }


  async remove(id: number) {
    // Gracias a onDelete: 'CASCADE' en Encuentro, borrar el fixture borrará sus partidos.
    const result = await this.fixtureRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fixture con ID ${id} no encontrado.`);
    }
    return { deleted: true, id };
  }
}