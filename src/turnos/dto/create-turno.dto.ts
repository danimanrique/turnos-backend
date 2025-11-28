import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTurnoDto {
  @IsInt()
  usuarioId: number;

  @IsInt()
  recursoId: number;

  @IsOptional()
  @IsInt()
  disponibilidadId?: number;

  @IsDateString()
  fechaHoraInicio: string;

  @IsDateString()
  fechaHoraFin: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  canalReserva?: string;
}
