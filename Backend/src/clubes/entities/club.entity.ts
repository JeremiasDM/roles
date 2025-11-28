// clubes/entities/club.entity.ts
import { Localidad } from '../../localidades/entities/localidad.entity';
import { Referente } from '../../referente/entities/referente.entity';
import { Jugador } from '../../jugador/entities/jugador.entity';
import { Encuentro } from '../../encuentro/entities/encuentro.entity';
import { Pago } from '../../pago/entities/pago.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column()
  categoria: 'masculino' | 'femenino';

  @Column()
  correo: string;

  @Column()
  telefono: string;

  @Column()
  fechaRegistro: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'mediumtext', nullable: true })
  logoUrl: string;

  // --- Relación con Localidad ---
  @Column()
  localidadId: number;

  @ManyToOne(() => Localidad, (localidad) => localidad.clubes)
  @JoinColumn({ name: 'localidadId' })
  localidad: Localidad;

  // --- Relaciones Inversas ---
  @OneToMany(() => Referente, (referente) => referente.club)
  referentes: Referente[];

  @OneToMany(() => Jugador, (jugador) => jugador.club)
  jugadores: Jugador[];

  @OneToMany(() => Encuentro, (encuentro) => encuentro.club1)
  partidosLocal: Encuentro[];

  @OneToMany(() => Encuentro, (encuentro) => encuentro.club2)
  partidosVisitante: Encuentro[];

  // --- NUEVO: Campos de Estadísticas ---
  @Column({ type: 'int', default: 0, nullable: true })
  pg: number; // Partidos Ganados

  @Column({ type: 'int', default: 0, nullable: true })
  pe: number; // Partidos Empatados

  @Column({ type: 'int', default: 0, nullable: true })
  pp: number; // Partidos Perdidos

  @Column({ type: 'int', default: 0, nullable: true })
  goles: number; // Goles (puede ser diferencia o a favor, ajustar según necesidad)

  @Column({ type: 'int', default: 0, nullable: true })
  puntos: number; // Puntos calculados

  @OneToMany(() => Pago, (pago) => pago.club)
  pagos: Pago[]; 
}