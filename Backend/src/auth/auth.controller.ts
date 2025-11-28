import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { correo: string; password: string }) {
    // 1. Validar credenciales
    const user = await this.authService.validateUser(body.correo, body.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Generar y devolver token
    return this.authService.login(user);
  }
}