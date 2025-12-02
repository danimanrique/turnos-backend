import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Recurso } from '../../recursos/entities/recurso.entity';

@Entity('tipos_recurso')
@Unique(['codigo'])
export class TipoRecurso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

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

  @OneToMany(() => Recurso, (recurso) => recurso.tipoRecurso)
  recursos?: Recurso[];
}
