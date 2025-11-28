import { Injectable } from '@nestjs/common';
import { ReferenteService } from '../referente/referente.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private referenteService: ReferenteService,
    private jwtService: JwtService
  ) {}

  async validateUser(correo: string, pass: string): Promise<any> {
    const user = await this.referenteService.findOneByEmailForAuth(correo);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // INCLUIMOS EL ROL EN EL PAYLOAD
    const payload = { 
      username: user.correo, 
      sub: user.id, 
      nombre: user.nombre,
      clubId: user.clubId,
      rol: user.rol // <--- IMPORTANTE
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: payload 
    };
  }
}