import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTipoRecursoDto {
  @IsString()
  nombre: string;

  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
