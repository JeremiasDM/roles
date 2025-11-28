import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JugadorService } from './jugador.service';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('jugadores')
export class JugadorController {
  constructor(private readonly jugadorService: JugadorService) {}

  // Crear: Presidenta y Referente
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA, Role.REFERENTE)
  create(@Body() createJugadorDto: CreateJugadorDto) {
    return this.jugadorService.create(createJugadorDto);
  }

  // Ver: Público (Para ver los planteles)
  @Get()
  findAll() {
    return this.jugadorService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jugadorService.findOne(id);
  }

  // Editar: Presidenta y Referente
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA, Role.REFERENTE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJugadorDto: UpdateJugadorDto,
  ) {
    return this.jugadorService.update(id, updateJugadorDto);
  }

  // Eliminar: Solo Presidenta (Por seguridad, o agrega REFERENTE si quieres que puedan borrar)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jugadorService.remove(id);
  }
}