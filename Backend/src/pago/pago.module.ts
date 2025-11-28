import { Module } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { ClubesModule } from '../clubes/clubes.module'; // Importante para la relación

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]), // Registra la entidad Pago con TypeORM
    ClubesModule, // Importa ClubesModule para que TypeORM reconozca la relación
    // Si tienes relación con Encuentro, importa EncuentroModule aquí también
  ],
  controllers: [PagoController], // Declara el controlador para este módulo
  providers: [PagoService],     // Declara el servicio para este módulo
})
export class PagoModule {}