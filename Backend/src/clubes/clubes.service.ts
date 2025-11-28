import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';
// REMOVED: import { ClubesService } from './clubes.service'; // <-- Remove this circular import

@Injectable()
export class ClubesService { // <-- Added 'export' keyword here
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  // Create: Saves new club, defaults for stats are handled by the entity definition
  async create(createClubDto: CreateClubDto): Promise<Club> {
    const nuevo = this.clubRepository.create({
      ...createClubDto,
      activo: true,
    });
    const savedClub = await this.clubRepository.save(nuevo);
    return this.findOne(savedClub.id, true);
  }

  // FindAll: Returns active clubs, ordered by name, includes stats fields
  findAll(): Promise<Club[]> {
    return this.clubRepository.find({
      where: { activo: true },
      relations: ['localidad'],
      order: { nombre: 'ASC' },
    });
  }

  // FindOne: Finds a single active club by ID, includes stats fields
  async findOne(id: number, includeRelations: boolean = true): Promise<Club> {
    const club = await this.clubRepository.findOne({
        where: { id, activo: true },
        relations: includeRelations ? ['localidad'] : [],
    });
    if (!club) {
      throw new NotFoundException(`Club activo con ID ${id} no encontrado.`);
    }
    return club;
  }

  // Update: Updates club data, recalculates points if pg or pe are changed
  async update(id: number, updateClubDto: UpdateClubDto): Promise<Club> {
    let pointsNeedsRecalculation = false;
    let pgValue = 0;
    let peValue = 0;

    if (updateClubDto.pg !== undefined || updateClubDto.pe !== undefined) {
        pointsNeedsRecalculation = true;
        const clubActual = await this.findOne(id, false);
        pgValue = updateClubDto.pg ?? clubActual.pg;
        peValue = updateClubDto.pe ?? clubActual.pe;
    }

    const dataToUpdate = { ...updateClubDto };
    if (pointsNeedsRecalculation) {
        dataToUpdate.puntos = pgValue * 3 + peValue;
    }

    const club = await this.clubRepository.preload({
      id: id,
      ...dataToUpdate,
    });

    if (!club) {
       const exists = await this.clubRepository.findOneBy({ id });
        if (!exists) {
            throw new NotFoundException(`Club con ID ${id} no encontrado.`);
        } else {
             throw new NotFoundException(`Club con ID ${id} está inactivo y no puede ser modificado directamente.`);
        }
    }

    const savedClub = await this.clubRepository.save(club);
    return this.findOne(savedClub.id, true);
  }

  // Remove: Soft delete by setting 'activo' to false
  async remove(id: number): Promise<Club> {
    const club = await this.findOne(id, false);
    club.activo = false;
    return this.clubRepository.save(club);
  }
}