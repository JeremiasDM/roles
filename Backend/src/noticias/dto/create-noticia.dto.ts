import { IsString, MinLength, IsDateString, IsOptional } from 'class-validator';

export class CreateNoticiaDto {
  @IsString()
  @MinLength(5)
  titulo: string;

  @IsString()
  contenido: string;

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}