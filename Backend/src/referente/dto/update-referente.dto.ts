import { PartialType } from '@nestjs/mapped-types';
import { CreateReferenteDto } from './create-referente.dto';

export class UpdateReferenteDto extends PartialType(CreateReferenteDto) {}