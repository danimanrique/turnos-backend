import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RecursosService } from './recursos.service';
import { CreateRecursoDto } from './dto/create-recurso.dto';

@Controller('recursos')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @Post()
  create(@Body() dto: CreateRecursoDto) {
    return this.recursosService.create(dto);
  }

  @Get()
  findAll(
    @Query('sucursalId') sucursalId?: string,
    @Query('tipoRecursoId') tipoRecursoId?: string,
  ) {
    return this.recursosService.findAll({
      sucursalId: sucursalId ? Number(sucursalId) : undefined,
      tipoRecursoId: tipoRecursoId ? Number(tipoRecursoId) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recursosService.findOne(id);
  }

  @Get(':id/slots-disponibles')
  obtenerSlots(@Param('id', ParseIntPipe) id: number, @Query('fecha') fecha: string) {
    return this.recursosService.obtenerSlotsDisponibles(id, fecha);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recursosService.remove(id);
  }
}
