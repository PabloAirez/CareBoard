import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegracaoBancoOrmEntity } from '../../integracao-banco/infraestructure/orm/integracao-banco-orm-entity';
import { SistemaExternoOrmEntity } from '../../sistema-externo/infraestructure/orm/sistema-externo-orm-entity';
import { EncryptionService } from '../application/services/encryption.service';
import { SighConnectionService } from '../application/services/sigh-connection.service';
import { SighSyncService } from '../application/services/sigh-sync.service';
import { SaveIntegracaoBancoDto, TestConnectionDto } from './dto/integracao-banco.dto';

@Controller('api/sigh')
export class IntegracaoBancoController {
  constructor(
    @InjectRepository(IntegracaoBancoOrmEntity)
    private readonly integracaoRepo: Repository<IntegracaoBancoOrmEntity>,
    @InjectRepository(SistemaExternoOrmEntity)
    private readonly sistemaExternoRepo: Repository<SistemaExternoOrmEntity>,
    private readonly encryptionService: EncryptionService,
    private readonly connectionService: SighConnectionService,
    private readonly syncService: SighSyncService,
  ) {}

  @Post('config')
  async saveConfig(@Body() dto: SaveIntegracaoBancoDto) {
    let sistemaExternoId = dto.sistemaExternoId;

    if (!sistemaExternoId) {
      let sistema = await this.sistemaExternoRepo.findOne({
        where: { nome: 'SIGH' },
      });
      if (!sistema) {
        sistema = await this.sistemaExternoRepo.save(
          this.sistemaExternoRepo.create({ nome: 'SIGH' }),
        );
      }
      sistemaExternoId = sistema.id;
    }

    const { ciphertextHex, ivHex, authTagHex } = this.encryptionService.encrypt(dto.senha);

    let integracao = await this.integracaoRepo.findOne({
      where: { hospitalId: dto.hospitalId },
    });

    if (integracao) {
      integracao.host = dto.host;
      integracao.porta = dto.porta;
      integracao.nomeBanco = dto.nomeBanco;
      integracao.usuario = dto.usuario;
      integracao.senhaCriptografada = ciphertextHex;
      integracao.ivCriptografia = ivHex;
      integracao.authTag = authTagHex;
      integracao.sistemaExternoId = sistemaExternoId;
    } else {
      integracao = this.integracaoRepo.create({
        hospitalId: dto.hospitalId,
        sistemaExternoId,
        host: dto.host,
        porta: dto.porta,
        nomeBanco: dto.nomeBanco,
        usuario: dto.usuario,
        senhaCriptografada: ciphertextHex,
        ivCriptografia: ivHex,
        authTag: authTagHex,
      });
    }

    const saved = await this.integracaoRepo.save(integracao);

    return {
      id: saved.id,
      hospitalId: saved.hospitalId,
      sistemaExternoId: saved.sistemaExternoId,
      host: saved.host,
      porta: saved.porta,
      nomeBanco: saved.nomeBanco,
      usuario: saved.usuario,
      status: 'configurado',
    };
  }

  @Get('config/:hospitalId')
  async getConfig(@Param('hospitalId', ParseIntPipe) hospitalId: number) {
    const integracao = await this.integracaoRepo.findOne({
      where: { hospitalId },
      relations: { sistemaExterno: true },
    });

    if (!integracao) {
      throw new NotFoundException('Configuracao de integracao nao encontrada para este hospital.');
    }

    return {
      id: integracao.id,
      hospitalId: integracao.hospitalId,
      sistemaExternoId: integracao.sistemaExternoId,
      sistemaExternoNome: integracao.sistemaExterno?.nome || 'SIGH',
      host: integracao.host,
      porta: integracao.porta,
      nomeBanco: integracao.nomeBanco,
      usuario: integracao.usuario,
      configurado: true,
    };
  }

  @Post('testar-conexao')
  @HttpCode(HttpStatus.OK)
  async testConnection(@Body() dto: TestConnectionDto) {
    const success = await this.connectionService.testConnection(dto);
    return {
      sucesso: success,
      mensagem: success ? 'Conexao com o banco SIGH estabelecida com sucesso!' : 'Falha ao conectar com o banco SIGH.',
    };
  }

  @Post('sincronizar-agora')
  @HttpCode(HttpStatus.OK)
  async syncNow() {
    await this.syncService.syncAll();
    return { mensagem: 'Sincronizacao iniciada com sucesso.' };
  }
}
