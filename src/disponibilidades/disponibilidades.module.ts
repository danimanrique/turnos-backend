import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisponibilidadesService } from './disponibilidades.service';
import { DisponibilidadesController } from './disponibilidades.controller';
import { Disponibilidad } from './entities/disponibilidad.entity';
import { Recurso } from '../recursos/entities/recurso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Disponibilidad, Recurso])],
  controllers: [DisponibilidadesController],
  providers: [DisponibilidadesService],
  exports: [DisponibilidadesService, TypeOrmModule],
})
export class DisponibilidadesModule {}
