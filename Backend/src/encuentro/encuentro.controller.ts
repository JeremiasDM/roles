import { 
  Controller, 
  Get, 
  Param, 
  ParseIntPipe, 
  Patch, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { EncuentroService } from './encuentro.service';
// Importaciones de Seguridad
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('encuentros')
export class EncuentroController {
  constructor(private readonly encuentroService: EncuentroService) {}

  // Ver partidos de un fixture: PÚBLICO
  @Get('fixture/:fixtureId')
  findAllByFixture(@Param('fixtureId', ParseIntPipe) fixtureId: number) {
      return this.encuentroService.findAllByFixture(fixtureId);
  }

  // Cargar Resultados (Actualizar Tabla): SOLO PRESIDENTA
  // Nota: Asegúrate de tener un DTO para actualizar el resultado (goles1, goles2)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENTA)
  updateResult(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any // Idealmente usa un UpdateEncuentroDto aquí
  ) {
      // Asumiendo que tu servicio tiene un método update
      return this.encuentroService.update(id, body); 
  }
}