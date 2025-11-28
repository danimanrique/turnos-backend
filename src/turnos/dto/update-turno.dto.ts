import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTurnoDto {
  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @IsOptional()
  @IsInt()
  recursoId?: number;

  @IsOptional()
  @IsInt()
  disponibilidadId?: number;

  @IsOptional()
  @IsDateString()
  fechaHoraInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaHoraFin?: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  canalReserva?: string;

  @IsOptional()
  @IsString()
  @IsIn(['RESERVADO', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO'])
  estado?: string;
}
