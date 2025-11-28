import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Recurso } from '../../recursos/entities/recurso.entity';
import { Turno } from '../../turnos/entities/turno.entity';

@Entity('disponibilidades')
export class Disponibilidad {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recurso, (recurso) => recurso.disponibilidades, {
    onDelete: 'CASCADE',
  })
  recurso: Recurso;

  @Column({ type: 'date' })
  fechaDesde: string;

  @Column({ type: 'date', nullable: true })
  fechaHasta?: string | null;

  // CSV con días de la semana (0=Domingo..6=Sábado). Ej: "1,3,5"
  @Column()
  diasSemana: string;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @Column({ type: 'int' })
  duracionSlotMin: number;

  @Column({ type: 'int', default: 1 })
  capacidadPorSlot: number;

  @Column({ default: 'ACTIVA' })
  estado: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @OneToMany(() => Turno, (turno) => turno.disponibilidad)
  turnos?: Turno[];
}
