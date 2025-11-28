// src/noticias/entities/noticia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Noticia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  titulo: string;

  @Column('text')
  contenido: string;

  @Column('date')
  fecha: string; // TypeORM manejará la conversión de string/date

@Column('mediumtext', { nullable: true }) // Cambiado de 'text' a 'mediumtext'
  imagenUrl?: string;
}