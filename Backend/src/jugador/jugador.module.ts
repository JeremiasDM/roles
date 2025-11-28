import { Module } from '@nestjs/common';
import { JugadorService } from './jugador.service';
import { JugadorController } from './jugador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from './entities/jugador.entity';
import { ClubesModule } from '../clubes/clubes.module'; // <-- Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([Jugador]),
    ClubesModule, // <-- Añadir
  ],
  controllers: [JugadorController],
  providers: [JugadorService],
})
export class JugadorModule {}