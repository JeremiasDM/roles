import { Club } from '../../clubes/entities/club.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  // --- INICIO DE LA CORRECCIÓN ---

  @Column({ nullable: true }) // <-- AÑADIR ESTO
  clubId: number; // Clave foránea

  @ManyToOne(() => Club, (club) => club.pagos, { // (club) => club.pagos es buena práctica
    onDelete: 'SET NULL',
    nullable: true // <-- AÑADIR ESTO
  })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  // --- FIN DE LA CORRECCIÓN ---

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ nullable: true })
  comprobante: string;

  @Column({ type: 'mediumtext', nullable: true })
  comprobanteArchivo: string;

  @CreateDateColumn()
  fecha: Date;

  @Column({ default: 'pendiente' })
  estado: string;

  @Column({ nullable: true })
  categoria: string;

  @Column({ nullable: true })
  partidoId: number;

  @Column({ nullable: true })
  cantidadJugadores: number;

  @Column({ nullable: true })
  motivo: string;
}