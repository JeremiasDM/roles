import { Encuentro } from '../../encuentro/entities/encuentro.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Fixture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string; // Fecha general del fixture/jornada

  @Column()
  lugar: string; // Sede

  // --- Relación con Encuentro (Un fixture tiene muchos partidos) ---
  @OneToMany(() => Encuentro, (encuentro) => encuentro.fixture)
  partidos: Encuentro[];
}