import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  BeforeInsert, 
  BeforeUpdate 
} from 'typeorm';
import { Club } from '../../clubes/entities/club.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../../auth/roles.enum'; // Importar el Enum

@Entity()
export class Referente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  correo: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ select: false }) 
  password: string;

  // --- NUEVO CAMPO ROL ---
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.REFERENTE, // Por defecto al registrarse es referente
  })
  rol: Role;

  @Column()
  clubId: number;

  @ManyToOne(() => Club, (club) => club.referentes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) { 
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}