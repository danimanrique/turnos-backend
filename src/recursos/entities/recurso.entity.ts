import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Disponibilidad } from '../../disponibilidades/entities/disponibilidad.entity';
import { Turno } from '../../turnos/entities/turno.entity';

@Entity('recursos')
export class Recurso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @OneToMany(() => Disponibilidad, (disp) => disp.recurso)
  disponibilidades?: Disponibilidad[];

  @OneToMany(() => Turno, (turno) => turno.recurso)
  turnos?: Turno[];
}
