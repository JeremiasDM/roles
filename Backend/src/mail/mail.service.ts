import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async enviarCredenciales(usuario: string, contrasenia: string, nombre: string) {
    await this.mailerService.sendMail({
      to: usuario, // El correo del referente
      subject: 'Bienvenido a Liga Handball Punilla - Tus Credenciales',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #1f3c88;">¡Hola ${nombre}!</h2>
          <p>Has sido registrado exitosamente como Referente en el sistema de la Liga.</p>
          <p>A continuación tus datos de acceso:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Usuario:</strong> ${usuario}</p>
            <p><strong>Contraseña Temporal:</strong> <span style="font-size: 1.2em; font-weight: bold; color: #333;">${contrasenia}</span></p>
          </div>

          <p style="color: #666; font-size: 0.9em;">Por favor, ingresa al sistema y cambia tu contraseña lo antes posible.</p>
          <br/>
          <p>Atentamente,<br/>Equipo Liga Punilla</p>
        </div>
      `,
    });
  }
}