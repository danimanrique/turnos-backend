import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Recurso } from '../../recursos/entities/recurso.entity';
import { Disponibilidad } from '../../disponibilidades/entities/disponibilidad.entity';

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.turnos, { eager: true })
  usuario: Usuario;

  @ManyToOne(() => Recurso, (recurso) => recurso.turnos, { eager: true })
  recurso: Recurso;

  @ManyToOne(() => Disponibilidad, (disp) => disp.turnos, {
    nullable: true,
    eager: true,
  })
  disponibilidad?: Disponibilidad | null;

  @Column({ type: 'datetime' })
  fechaHoraInicio: Date;

  @Column({ type: 'datetime' })
  fechaHoraFin: Date;

  @Column({ default: 'RESERVADO' })
  estado: string;

  @Column({ nullable: true })
  motivo?: string;

  @Column({ nullable: true })
  canalReserva?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
