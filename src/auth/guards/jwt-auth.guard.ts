import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Reutilizable en cualquier endpoint protegido: @UseGuards(JwtAuthGuard)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
