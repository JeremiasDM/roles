import { Module } from '@nestjs/common';
import { EncuentroService } from './encuentro.service';
import { EncuentroController } from './encuentro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encuentro } from './entities/encuentro.entity';
import { ClubesModule } from '../clubes/clubes.module'; // Importar Clubes

@Module({
  imports: [
    TypeOrmModule.forFeature([Encuentro]),
    ClubesModule, // Necesario para la relación
  ],
  controllers: [EncuentroController],
  providers: [EncuentroService],
  exports: [TypeOrmModule, EncuentroService] // Exportar para que FixtureModule lo use
})
export class EncuentroModule {}