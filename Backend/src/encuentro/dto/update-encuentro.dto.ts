import { PartialType } from '@nestjs/mapped-types';
import { CreateEncuentroDto } from './create-encuentro.dto';

export class UpdateEncuentroDto extends PartialType(CreateEncuentroDto) {}
