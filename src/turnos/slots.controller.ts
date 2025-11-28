import { Controller, Get, Param, Query } from '@nestjs/common';
import { TurnosService } from './turnos.service';

@Controller('recursos')
export class SlotsController {
  constructor(private readonly turnosService: TurnosService) {}

  @Get(':recursoId/slots-disponibles')
  obtenerSlots(
    @Param('recursoId') recursoId: string,
    @Query('fecha') fecha: string,
  ) {
    return this.turnosService.obtenerSlotsDisponibles(+recursoId, fecha);
  }
}
