// src/pago/dto/update-pago.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoDto } from './create-pago.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdatePagoDto extends PartialType(CreatePagoDto) {
  @IsOptional()
  @IsEnum(['pendiente', 'pagado', 'validado', 'invalido'])
  estado?: string;
}