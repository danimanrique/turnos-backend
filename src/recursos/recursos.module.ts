import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursosService } from './recursos.service';
import { RecursosController } from './recursos.controller';
import { Recurso } from './entities/recurso.entity';
import { Disponibilidad } from '../disponibilidades/entities/disponibilidad.entity';
import { Turno } from '../turnos/entities/turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recurso, Disponibilidad, Turno])],
  controllers: [RecursosController],
  providers: [RecursosService],
  exports: [RecursosService, TypeOrmModule],
})
export class RecursosModule {}
