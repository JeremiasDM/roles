import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateEncuentroDto } from '../../encuentro/dto/create-encuentro.dto';

export class CreateFixtureDto {
  @IsDateString() // O IsString si prefieres manejar la fecha como string
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  lugar: string;

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto en el array
  @Type(() => CreateEncuentroDto) // Necesario para la validación anidada
  partidos: CreateEncuentroDto[];
}