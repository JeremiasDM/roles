import { Injectable } from '@nestjs/common';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';

@Injectable()
export class LocalidadesService {
  create(createLocalidadDto: CreateLocalidadDto) {
    return 'This action adds a new localidade';
  }

  findAll() {
    return `This action returns all localidades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} localidade`;
  }

  update(id: number, updateLocalidadDto: UpdateLocalidadDto) {
    return `This action updates a #${id} localidade`;
  }

  remove(id: number) {
    return `This action removes a #${id} localidade`;
  }
}
