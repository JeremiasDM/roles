import { Module } from '@nestjs/common';
import { ReferenteService } from './referente.service';
import { ReferenteController } from './referente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referente } from './entities/referente.entity';
import { ClubesModule } from '../clubes/clubes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Referente]),
    ClubesModule,
  ],
  controllers: [ReferenteController],
  providers: [ReferenteService],
  exports: [ReferenteService] // <--- ESTA LÍNEA ES OBLIGATORIA
})
export class ReferenteModule {}