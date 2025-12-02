import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Disponibilidad } from '../../disponibilidades/entities/disponibilidad.entity';
import { Turno } from '../../turnos/entities/turno.entity';
import { Sucursal } from '../../sucursales/entities/sucursal.entity';
import { TipoRecurso } from '../../tipos-recurso/entities/tipo-recurso.entity';

@Entity('recursos')
export class Recurso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Campo "tipo" se reemplaza por la relación con TipoRecurso.
  // @Column({ nullable: true })
  // tipo?: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.recursos, { eager: false })
  @JoinColumn({ name: 'sucursalId' })
  sucursal: Sucursal;

  @Column()
  sucursalId: number;

  @ManyToOne(() => TipoRecurso, (tipo) => tipo.recursos, { eager: false })
  @JoinColumn({ name: 'tipoRecursoId' })
  tipoRecurso: TipoRecurso;

  @Column()
  tipoRecursoId: number;

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
