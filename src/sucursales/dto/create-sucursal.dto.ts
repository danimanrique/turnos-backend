import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  slogan?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsInt()
  usuarioId: number;
}
