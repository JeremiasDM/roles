// src/noticias/noticias.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { Noticia } from './entities/noticia.entity';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(Noticia)
    private readonly noticiaRepository: Repository<Noticia>,
  ) {}

  create(createNoticiaDto: CreateNoticiaDto): Promise<Noticia> {
    const nueva = this.noticiaRepository.create(createNoticiaDto);
    return this.noticiaRepository.save(nueva);
  }

  findAll(): Promise<Noticia[]> {
    // Ordenar por fecha descendente, como en el frontend
    return this.noticiaRepository.find({
      order: {
        fecha: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Noticia> {
    const noticia = await this.noticiaRepository.findOneBy({ id });
    if (!noticia) {
      throw new NotFoundException(`Noticia con ID ${id} no encontrada.`);
    }
    return noticia;
  }

  async update(id: number, updateNoticiaDto: UpdateNoticiaDto): Promise<Noticia> {
    // 'preload' busca la entidad y la fusiona con el DTO
    const noticia = await this.noticiaRepository.preload({
      id: id,
      ...updateNoticiaDto,
    });
    
    if (!noticia) {
      throw new NotFoundException(`Noticia con ID ${id} no encontrada para actualizar.`);
    }
    
    return this.noticiaRepository.save(noticia);
  }

  async remove(id: number): Promise<Noticia> {
    const noticia = await this.findOne(id);
    return this.noticiaRepository.remove(noticia);
  }
}