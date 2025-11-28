import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants'; // Asegúrate de tener este archivo con tu 'secret'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // Esto inyecta el usuario en 'request.user' para que el RolesGuard lo lea
    return { 
      userId: payload.sub, 
      username: payload.username, 
      rol: payload.rol, // Importante: el payload debe traer el rol (ver auth.service.ts)
      clubId: payload.clubId 
    };
  }
}