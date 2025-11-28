import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { FilterTurnoDto } from './dto/filter-turno.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  create(@Body() dto: CreateTurnoDto) {
    return this.turnosService.create(dto);
  }

  @UseGuards(JwtAuthGuard) // reutilizar este guard en otros endpoints protegidos
  @Get()
  findAll(@Query() filtros: FilterTurnoDto) {
    return this.turnosService.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosService.remove(+id);
  }
}
