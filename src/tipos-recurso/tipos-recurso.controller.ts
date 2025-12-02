import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TiposRecursoService } from './tipos-recurso.service';
import { CreateTipoRecursoDto } from './dto/create-tipo-recurso.dto';

@Controller('tipos-recurso')
export class TiposRecursoController {
  constructor(private readonly service: TiposRecursoService) {}

  @Post()
  create(@Body() dto: CreateTipoRecursoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
