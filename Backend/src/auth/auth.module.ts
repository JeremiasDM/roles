// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ReferenteModule } from '../referente/referente.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <--- 1. IMPORTAR ESTO
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy'; // <--- 2. IMPORTAR ESTO

@Module({
  imports: [
    ReferenteModule,
    PassportModule, // <--- 3. AGREGAR A IMPORTS
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy // <--- 4. AGREGAR A PROVIDERS (¡Crucial!)
  ],
  exports: [AuthService],
})
export class AuthModule {}