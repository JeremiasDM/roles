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
import { ClubesService } from './clubes.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Asumiendo que creaste este guard estándar
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('clubes')
export class ClubesController {
  constructor(private readonly clubesService: ClubesService) {}

  // Crear: Solo Presidenta
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA)
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubesService.create(createClubDto);
  }

  // Ver: Público (Anónimos pueden ver)
  @Get()
  findAll() {
    return this.clubesService.findAll();
  }

  // Ver Detalle: Público
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clubesService.findOne(id);
  }

  // Editar: Solo Presidenta
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClubDto: UpdateClubDto,
  ) {
    return this.clubesService.update(id, updateClubDto);
  }

  // Eliminar: Solo Presidenta
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clubesService.remove(id);
  }
}