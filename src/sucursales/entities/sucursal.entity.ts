import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Recurso } from '../../recursos/entities/recurso.entity';

@Entity('sucursales')
export class Sucursal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  direccion?: string;

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

  @OneToMany(() => Recurso, (recurso) => recurso.sucursal)
  recursos?: Recurso[];
}
