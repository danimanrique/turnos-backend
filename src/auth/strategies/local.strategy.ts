import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Usuario> {
    try {
      return await this.authService.validateUser(email, password);
    } catch (err) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }
}
