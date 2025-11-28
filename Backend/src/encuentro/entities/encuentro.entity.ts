import { Club } from '../../clubes/entities/club.entity';
import { Fixture } from '../../fixture/entities/fixture.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Encuentro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jornada: number;

  @Column({ nullable: true })
  grupo: string; // Puede ser null si no hay grupos

  @Column({ nullable: true })
  fecha?: string; // Fecha específica del partido, si difiere del fixture

  @Column({ default: '-' })
  resultado: string;

  // --- Relación con Fixture (Muchos encuentros pertenecen a un Fixture) ---
  @Column()
  fixtureId: number;

  @ManyToOne(() => Fixture, (fixture) => fixture.partidos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fixtureId' })
  fixture: Fixture;

  // --- Relación con Club (Local) ---
  @Column()
  club1Id: number; // Clave foránea para el club local

  @ManyToOne(() => Club, (club) => club.partidosLocal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'club1Id' })
  club1: Club;

  // --- Relación con Club (Visitante) ---
  @Column()
  club2Id: number; // Clave foránea para el club visitante

  @ManyToOne(() => Club, (club) => club.partidosVisitante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'club2Id' })
  club2: Club;
}