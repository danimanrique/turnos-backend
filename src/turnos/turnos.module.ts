import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { Turno } from './entities/turno.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Recurso } from '../recursos/entities/recurso.entity';
import { Disponibilidad } from '../disponibilidades/entities/disponibilidad.entity';
import { SlotsController } from './slots.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, Usuario, Recurso, Disponibilidad])],
  controllers: [TurnosController, SlotsController],
  providers: [TurnosService],
  exports: [TurnosService],
})
export class TurnosModule {}
