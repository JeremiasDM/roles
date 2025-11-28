import { Club } from '../../clubes/entities/club.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Jugador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  dni: string;

  @Column()
  categoria: string; // 'Masculino' o 'Femenino'

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  vencimiento: string; // Guardado como string de fecha 'YYYY-MM-DD'

  @Column({ default: 'activo' })
  estado: string; // activo, lesionado, sancionado, inactivo

  // --- Relación con Club ---
  @Column()
  clubId: number;

  @ManyToOne(() => Club, (club) => club.jugadores, {
    onDelete: 'CASCADE', // Si se borra el club, se borra el jugador
  })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  // --- Campos para Base64 ---
  // Usamos mediumtext para que soporte el tamaño de la cadena Base64
  @Column({ type: 'mediumtext', nullable: true })
  carnetUrl: string;

  @Column({ type: 'mediumtext', nullable: true })
  fichaMedicaUrl: string;
}