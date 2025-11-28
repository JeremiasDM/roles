import { IsString, MinLength } from 'class-validator';
export class CreateLocalidadDto {
  @IsString()
  @MinLength(3)
  nombre: string;
}