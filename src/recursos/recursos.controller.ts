import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  findAll() {
    return this.recursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recursosService.findOne(+id);
  }

  @Get(':id/slots-disponibles')
  obtenerSlots(@Param('id') id: string, @Query('fecha') fecha: string) {
    return this.recursosService.obtenerSlotsDisponibles(+id, fecha);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recursosService.remove(+id);
  }
}
