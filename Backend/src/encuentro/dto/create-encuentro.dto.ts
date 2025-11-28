import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEncuentroDto {
  @IsInt()
  @IsNotEmpty()
  jornada: number;

  @IsOptional()
  @IsString()
  grupo?: string;

  @IsOptional()
  @IsString() // Puedes usar IsDateString si prefieres
  fecha?: string;

  @IsString()
  @IsNotEmpty()
  resultado: string;

  @IsInt()
  @IsNotEmpty()
  club1Id: number; // <-- ID del club local

  @IsInt()
  @IsNotEmpty()
  club2Id: number; // <-- ID del club visitante

  // fixtureId se asignará internamente
}