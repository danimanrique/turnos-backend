import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RecursosModule } from './recursos/recursos.module';
import { DisponibilidadesModule } from './disponibilidades/disponibilidades.module';
import { TurnosModule } from './turnos/turnos.module';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Recurso } from './recursos/entities/recurso.entity';
import { Disponibilidad } from './disponibilidades/entities/disponibilidad.entity';
import { Turno } from './turnos/entities/turno.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'turnero',
      entities: [Usuario, Recurso, Disponibilidad, Turno],
      synchronize: true, // For dev/demo; disable in production
    }),
    UsuariosModule,
    RecursosModule,
    DisponibilidadesModule,
    TurnosModule,
    AuthModule,
  ],
})
export class AppModule {}
