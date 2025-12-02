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
import { Recurso } from '../../recursos/entities/recurso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

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

  @Column({ nullable: true })
  slogan?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.sucursales, { eager: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario?: Usuario;

  @Column()
  usuarioId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @OneToMany(() => Recurso, (recurso) => recurso.sucursal)
  recursos?: Recurso[];
}
