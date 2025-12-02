import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposRecursoController } from './tipos-recurso.controller';
import { TiposRecursoService } from './tipos-recurso.service';
import { TipoRecurso } from './entities/tipo-recurso.entity';
import { Recurso } from '../recursos/entities/recurso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoRecurso, Recurso])],
  controllers: [TiposRecursoController],
  providers: [TiposRecursoService],
  exports: [TiposRecursoService, TypeOrmModule],
})
export class TiposRecursoModule {}
