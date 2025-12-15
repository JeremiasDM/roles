import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // O el host que uses (ej: smtp.office365.com)
        port: 587, 
        secure: false, // true para puerto 465, false para otros puertos
        auth: {
          user: 'jeremiasmaldonadoescuela@gmail.com', // <--- ESCRIBE TU CORREO AQUÍ
          pass: 'stwq fbvd ttke hils', // <--- ESCRIBE TU CONTRASEÑA AQUÍ
        },
      },
      defaults: {
        from: '"Liga Punilla" <jeremiasmaldonadoescuela@gmail.co>', // <--- EL MISMO CORREO DE ARRIBA
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}