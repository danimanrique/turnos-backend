import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { SucursalesService } from './sucursales.service';
import { SucursalesController } from './sucursales.controller';
import { Recurso } from '../recursos/entities/recurso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sucursal, Recurso, Usuario])],
  controllers: [SucursalesController],
  providers: [SucursalesService],
  exports: [SucursalesService, TypeOrmModule],
})
export class SucursalesModule {}
