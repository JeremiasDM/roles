import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe 
} from '@nestjs/common';
import { ReferenteService } from './referente.service';
import { CreateReferenteDto } from './dto/create-referente.dto';
import { UpdateReferenteDto } from './dto/update-referente.dto';

@Controller('referentes')
export class ReferenteController {
  constructor(private readonly referenteService: ReferenteService) {}

  @Post()
  create(@Body() createReferenteDto: CreateReferenteDto) {
    return this.referenteService.create(createReferenteDto);
  }

  @Get()
  findAll() {
    return this.referenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.referenteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReferenteDto: UpdateReferenteDto) {
    return this.referenteService.update(id, updateReferenteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.referenteService.remove(id);
  }

  // --- Nuevo Endpoint: Cambiar Contraseña ---
  // Uso: PATCH /referentes/change-password
  // Body: { "id": 1, "newPassword": "miNuevaPassword" }
  @Patch('auth/change-password') 
  async changePassword(@Body() body: { id: number, newPassword: string }) {
    return this.referenteService.changePassword(body.id, body.newPassword);
  }
}