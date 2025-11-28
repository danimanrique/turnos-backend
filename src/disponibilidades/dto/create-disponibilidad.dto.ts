import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateDisponibilidadDto {
  @IsDateString()
  fechaDesde: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @IsString()
  @IsNotEmpty()
  diasSemana: string;

  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @IsString()
  @IsNotEmpty()
  horaFin: string;

  @IsInt()
  @IsPositive()
  duracionSlotMin: number;

  @IsInt()
  @Min(1)
  capacidadPorSlot: number;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVA', 'PAUSADA', 'ARCHIVADA'])
  estado?: string;
}
