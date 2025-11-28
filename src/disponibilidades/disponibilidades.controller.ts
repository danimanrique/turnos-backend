import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { DisponibilidadesService } from './disponibilidades.service';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';

@Controller()
export class DisponibilidadesController {
  constructor(
    private readonly disponibilidadesService: DisponibilidadesService,
  ) {}

  @Post('recursos/:recursoId/disponibilidades')
  create(
    @Param('recursoId') recursoId: string,
    @Body() dto: CreateDisponibilidadDto,
  ) {
    return this.disponibilidadesService.create(+recursoId, dto);
  }

  @Get('recursos/:recursoId/disponibilidades')
  findByRecurso(@Param('recursoId') recursoId: string) {
    return this.disponibilidadesService.findByRecurso(+recursoId);
  }

  @Delete('disponibilidades/:id')
  remove(@Param('id') id: string) {
    return this.disponibilidadesService.remove(+id);
  }
}
