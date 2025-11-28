// clubes/dto/create-club.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsInt, // <-- Importar
  IsEnum,
} from 'class-validator';

enum CategoriaClub {
  MASCULINO = 'masculino',
  FEMENINO = 'femenino',
}

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(CategoriaClub)
  @IsNotEmpty()
  categoria: 'masculino' | 'femenino';

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsDateString()
  @IsNotEmpty()
  fechaRegistro: string;

  // --- CAMBIO OBLIGATORIO ---
  @IsInt() // Valida que es un número
  @IsNotEmpty()
  localidadId: number;
  
  // (Asegúrese de ELIMINAR cualquier línea como: @IsString() localidad: string;)

  @IsOptional()
  @IsString()
  logoUrl?: string;

  // (No incluya 'activo' aquí)
}