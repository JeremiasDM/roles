import { PartialType } from '@nestjs/mapped-types';
import { CreateClubDto } from './create-club.dto';
import { IsInt, IsOptional, Min } from 'class-validator'; // <-- Añadir imports

export class UpdateClubDto extends PartialType(CreateClubDto) {
  // --- NUEVO: Validación opcional para estadísticas ---
  @IsOptional()
  @IsInt()
  @Min(0)
  pg?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  pe?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  pp?: number;

  @IsOptional()
  @IsInt()
  // @Min(0) // Goles (diferencia) puede ser negativo
  goles?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  puntos?: number;
}