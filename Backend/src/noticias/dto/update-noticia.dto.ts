import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticiaDto } from './create-noticia.dto';

// UpdateNoticiaDto hereda todas las validaciones de CreateNoticiaDto,
// pero las hace todas opcionales.
export class UpdateNoticiaDto extends PartialType(CreateNoticiaDto) {}