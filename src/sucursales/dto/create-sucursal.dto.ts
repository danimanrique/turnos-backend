import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSucursalDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
