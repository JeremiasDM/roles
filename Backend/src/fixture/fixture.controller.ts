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
import { FixtureService } from './fixture.service';
import { CreateFixtureDto } from './dto/create-fixture.dto';
import { UpdateFixtureDto } from './dto/update-fixture.dto';
// Importaciones de Seguridad
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('fixtures')
export class FixtureController {
  constructor(private readonly fixtureService: FixtureService) {}

  // Crear Fixture: SOLO PRESIDENTA
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA)
  create(@Body() createFixtureDto: CreateFixtureDto) {
    return this.fixtureService.create(createFixtureDto);
  }

  // Ver todos: PÚBLICO
  @Get()
  findAll() {
    return this.fixtureService.findAll();
  }

  // Ver uno: PÚBLICO
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fixtureService.findOne(id);
  }

  // Editar Fixture (Fechas/Lugares): SOLO PRESIDENTA
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFixtureDto: UpdateFixtureDto,
  ) {
    return this.fixtureService.update(id, updateFixtureDto);
  }

  // Eliminar Fixture: SOLO PRESIDENTA
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fixtureService.remove(id);
  }
}