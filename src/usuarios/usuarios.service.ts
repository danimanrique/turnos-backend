import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuariosRepo.create(dto);
    return this.usuariosRepo.save(usuario);
  }

  findActiveByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepo.findOne({
      where: { email, deletedAt: null, activo: true },
    });
  }

  async findActiveById(id: number): Promise<Usuario | null> {
    return this.usuariosRepo.findOne({
      where: { id, deletedAt: null, activo: true },
    });
  }

  findAll(): Promise<Usuario[]> {
    return this.usuariosRepo.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);
    Object.assign(usuario, dto);
    return this.usuariosRepo.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuariosRepo.softRemove(usuario);
  }
}
