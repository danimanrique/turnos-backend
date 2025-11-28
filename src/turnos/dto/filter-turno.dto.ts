import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class FilterTurnoDto {
  @IsOptional()
  @IsInt()
  recursoId?: number;

  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @IsOptional()
  @IsDateString()
  desde?: string;

  @IsOptional()
  @IsDateString()
  hasta?: string;
}
