import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTurnoDto {
  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  usuarioNombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  usuarioApellido?: string;

  @IsOptional()
  @IsEmail()
  usuarioEmail?: string;

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
