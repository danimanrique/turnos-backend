import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  async register(data: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
  }): Promise<Omit<Usuario, 'passwordHash'>> {
    const existing = await this.usuariosRepo.findOne({
      where: { email: data.email },
      withDeleted: true, // evita reusar emails soft-deleted
    });
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(data.password, 10); // hash en el borde del servicio
    const usuario = this.usuariosRepo.create({
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      passwordHash,
      activo: true,
    });
    const saved = await this.usuariosRepo.save(usuario);
    const { passwordHash: _, ...rest } = saved;
    return rest;
  }

  async validateUser(email: string, password: string): Promise<Usuario> {
    const usuario = await this.usuariosService.findActiveByEmail(email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const ok = await bcrypt.compare(password, usuario.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return usuario;
  }

  async login(usuario: Usuario) {
    const payload = { sub: usuario.id, email: usuario.email }; // payload JWT minimal
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      },
    };
  }
}
