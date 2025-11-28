// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Referente } from '../referente/entities/referente.entity';
import { Club } from '../clubes/entities/club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Referente, Club])],
  providers: [SeedService],
})
export class SeedModule {}