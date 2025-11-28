import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NoticiasModule } from './noticias/noticias.module';
import { LocalidadesModule } from './localidades/localidades.module';
import { ClubesModule } from './clubes/clubes.module';
import { AuthModule } from './auth/auth.module';
import { ReferenteModule } from './referente/referente.module';
import { JugadorModule } from './jugador/jugador.module';
import { EncuentroModule } from './encuentro/encuentro.module';
import { FixtureModule } from './fixture/fixture.module';
import { PagoModule } from './pago/pago.module';
import { SeedModule } from './seed/seed.module'; // <--- 1. IMPORTAR ESTO

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'shinkansen.proxy.rlwy.net',
            port: 59556,
            username: 'root',
            password: 'CimVqFrWEhogJruXrlHYQPJWVgNpuiWa',
            database: 'railway',
            autoLoadEntities: true,
            synchronize: true,
        }),

        // Módulos de la aplicación
        NoticiasModule,
        LocalidadesModule,
        ClubesModule,
        AuthModule,
        ReferenteModule,
        JugadorModule,
        EncuentroModule,
        FixtureModule,
        PagoModule,
        SeedModule, // <--- 2. AGREGAR ESTO AL ARRAY
    ],
})
export class AppModule { }