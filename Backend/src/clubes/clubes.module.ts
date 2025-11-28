import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './entities/club.entity'; // <-- CORREGIDO
import { ClubesController } from './clubes.controller';
import { ClubesService } from './clubes.service';
// Importa otros módulos si ClubesModule los necesita (ej. LocalidadesModule)
// import { LocalidadesModule } from '../localidades/localidades.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club]),
    // LocalidadesModule, // Descomenta si necesitas inyectar LocalidadesService aquí
  ],
  controllers: [ClubesController],
  providers: [ClubesService],
  exports: [TypeOrmModule, ClubesService] // Exporta si otros módulos necesitan ClubRepository o ClubesService
})
export class ClubesModule {}