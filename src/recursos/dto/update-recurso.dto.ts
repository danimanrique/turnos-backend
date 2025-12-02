import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateRecursoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsInt()
  sucursalId?: number;

  @IsOptional()
  @IsInt()
  tipoRecursoId?: number;
}
