import 'dotenv/config';
import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RecursosModule } from './recursos/recursos.module';
import { DisponibilidadesModule } from './disponibilidades/disponibilidades.module';
import { TurnosModule } from './turnos/turnos.module';
import { AuthModule } from './auth/auth.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { TiposRecursoModule } from './tipos-recurso/tipos-recurso.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { environments } from 'environment/environments';
import config from 'environment/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || './environment/.env',
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
    UsuariosModule,
    RecursosModule,
    DisponibilidadesModule,
    TurnosModule,
    AuthModule,
    SucursalesModule,
    TiposRecursoModule,
  ],
})
export class AppModule {}
