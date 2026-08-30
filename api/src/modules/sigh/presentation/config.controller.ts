import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegracaoBancoOrmEntity } from '../../integracao-banco/infraestructure/orm/integracao-banco-orm-entity';
import { HospitalOrmEntity } from '../../hospital/infraestructure/orm/hospital-orm-entity';
import { SistemaExternoOrmEntity } from '../../sistema-externo/infraestructure/orm/sistema-externo-orm-entity';
import { EncryptionService } from '../application/services/encryption.service';
import { SighSyncService } from '../application/services/sigh-sync.service';

@Controller('config')
export class ConfigController {
  constructor(
    @InjectRepository(IntegracaoBancoOrmEntity)
    private readonly integracaoRepo: Repository<IntegracaoBancoOrmEntity>,
    @InjectRepository(HospitalOrmEntity)
    private readonly hospitalRepo: Repository<HospitalOrmEntity>,
    @InjectRepository(SistemaExternoOrmEntity)
    private readonly sistemaExternoRepo: Repository<SistemaExternoOrmEntity>,
    private readonly encryptionService: EncryptionService,
    private readonly syncService: SighSyncService,
  ) {}

  @Get('status')
  async getStatus() {
    const count = await this.integracaoRepo.count();
    return {
      isConfigured: count > 0,
    };
  }

  @Post('setup')
  @HttpCode(HttpStatus.OK)
  async setup(@Body() body: any) {
    const hospitalName = body.hospitalName || 'CareBoard Hospital';
    const systemName = body.system || 'SIGH';
    const host = body.host;
    const porta = Number(body.port || body.porta || 5432);
    const nomeBanco = body.dbName || body.nomeBanco;
    const usuario = body.dbUser || body.usuario;
    const senha = body.dbPassword || body.senha;

    if (!host || !nomeBanco || !usuario || !senha) {
      return {
        isConfigured: false,
        message: 'Preencha todos os campos obrigatorios da integracao.',
      };
    }

    // 1. Hospital
    let hospital = await this.hospitalRepo.findOne({
      where: { nome: hospitalName },
    });
    if (!hospital) {
      const existingHospitals = await this.hospitalRepo.find({ order: { id: 'ASC' }, take: 1 });
      hospital = existingHospitals[0] || null;
    }
    if (!hospital) {
      hospital = await this.hospitalRepo.save(
        this.hospitalRepo.create({
          nome: hospitalName,
          cnpj: '00.000.000/0001-00',
          endereco: 'Avenida Central, 1000',
        }),
      );
    }

    // 2. Sistema Externo
    let sistema = await this.sistemaExternoRepo.findOne({
      where: { nome: systemName },
    });
    if (!sistema) {
      sistema = await this.sistemaExternoRepo.save(
        this.sistemaExternoRepo.create({ nome: systemName }),
      );
    }

    // 3. Encrypt password AES-256-GCM
    const { ciphertextHex, ivHex, authTagHex } = this.encryptionService.encrypt(senha);

    // 4. Save IntegracaoBanco
    let integracao = await this.integracaoRepo.findOne({
      where: { hospitalId: hospital.id },
    });

    if (integracao) {
      integracao.host = host;
      integracao.porta = porta;
      integracao.nomeBanco = nomeBanco;
      integracao.usuario = usuario;
      integracao.senhaCriptografada = ciphertextHex;
      integracao.ivCriptografia = ivHex;
      integracao.authTag = authTagHex;
      integracao.sistemaExternoId = sistema.id;
    } else {
      integracao = this.integracaoRepo.create({
        hospitalId: hospital.id,
        sistemaExternoId: sistema.id,
        host,
        porta,
        nomeBanco,
        usuario,
        senhaCriptografada: ciphertextHex,
        ivCriptografia: ivHex,
        authTag: authTagHex,
      });
    }

    await this.integracaoRepo.save(integracao);

    // 5. Trigger initial sync in background
    void this.syncService.syncAll();

    return {
      isConfigured: true,
      message: 'Configuracao salva com sucesso! Sincronizacao com o SIGH iniciada.',
    };
  }
}
