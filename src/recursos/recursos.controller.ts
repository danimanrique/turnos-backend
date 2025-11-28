import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { RecursosService } from './recursos.service';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { UpdateRecursoDto } from './dto/update-recurso.dto';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recursosService.remove(+id);
  }
}
