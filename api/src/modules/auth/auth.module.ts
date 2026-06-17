import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternacaoOrmEntity } from '../internacao/infraestructure/orm/internacao-orm-entity';
import { LeitoOrmEntity } from '../leito/infraestructure/orm/leito-orm-entity';
import { UsuarioOrmEntity } from '../usuario/infraestructure/orm/usuario-orm-entity';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioOrmEntity,
      LeitoOrmEntity,
      InternacaoOrmEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
