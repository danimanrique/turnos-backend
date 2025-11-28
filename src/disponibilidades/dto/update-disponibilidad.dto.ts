import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class UpdateDisponibilidadDto {
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @IsOptional()
  @IsString()
  diasSemana?: string;

  @IsOptional()
  @IsString()
  horaInicio?: string;

  @IsOptional()
  @IsString()
  horaFin?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  duracionSlotMin?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacidadPorSlot?: number;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVA', 'PAUSADA', 'ARCHIVADA'])
  estado?: string;
}
