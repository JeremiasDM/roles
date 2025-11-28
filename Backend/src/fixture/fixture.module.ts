import { Module } from '@nestjs/common';
import { FixtureService } from './fixture.service';
import { FixtureController } from './fixture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fixture } from './entities/fixture.entity';
import { EncuentroModule } from '../encuentro/encuentro.module'; // Importar EncuentroModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Fixture]),
    EncuentroModule, // Importar para usar el repositorio de Encuentro
  ],
  controllers: [FixtureController],
  providers: [FixtureService],
})
export class FixtureModule {}