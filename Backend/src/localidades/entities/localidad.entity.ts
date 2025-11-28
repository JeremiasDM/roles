// localidades/entities/localidad.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Club } from '../../clubes/entities/club.entity';

@Entity()
export class Localidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  // Opcional: Define la relación inversa (si un club pertenece a una localidad)
  @OneToMany(() => Club, (club) => club.localidad)
  clubes: Club[];
}