import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Asumo que tienes este o AuthGuard('jwt')
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('pagos')
// 1. Protegemos todo el controlador con JWT y Roles
@UseGuards(JwtAuthGuard, RolesGuard) 
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post()
  // 2. Definimos quién puede crear pagos: Presidenta, Tesorero, Referente
  @Roles(Role.PRESIDENTA, Role.TESORERO, Role.REFERENTE)
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(createPagoDto);
  }

  @Get()
  // Todos los logueados pueden ver pagos (o restringe si quieres)
  findAll() {
    return this.pagoService.findAll();
  }

  @Patch(':id')
  // Editar: Tesorero y Presidenta (Referente quizás no debería editar pagos ya hechos)
  @Roles(Role.PRESIDENTA, Role.TESORERO) 
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }

  @Delete(':id')
  // Eliminar: Solo Presidenta
  @Roles(Role.PRESIDENTA)
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }
}