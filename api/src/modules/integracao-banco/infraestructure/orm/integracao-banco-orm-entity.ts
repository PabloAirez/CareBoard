import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HospitalOrmEntity } from '../../../hospital/infraestructure/orm/hospital-orm-entity';
import { SistemaExternoOrmEntity } from '../../../sistema-externo/infraestructure/orm/sistema-externo-orm-entity';

@Entity('integracao_banco')
export class IntegracaoBancoOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'hospital_id', type: 'int' })
  hospitalId!: number;

  @Column({ name: 'sistema_externo_id', type: 'int' })
  sistemaExternoId!: number;

  @Column({ name: 'host', type: 'text' })
  host!: string;

  @Column({ name: 'porta', type: 'int' })
  porta!: number;

  @Column({ name: 'nome_banco', type: 'text' })
  nomeBanco!: string;

  @Column({ name: 'usuario', type: 'text' })
  usuario!: string;

  /** Senha cifrada em AES-256-GCM (hex) */
  @Column({ name: 'senha_criptografada', type: 'text' })
  senhaCriptografada!: string;

  /** IV usado na cifragem (hex, 12 bytes -> 24 chars) */
  @Column({ name: 'iv_criptografia', type: 'text' })
  ivCriptografia!: string;

  /** Auth tag do GCM (hex, 16 bytes -> 32 chars) */
  @Column({ name: 'auth_tag', type: 'text' })
  authTag!: string;

  @ManyToOne(() => HospitalOrmEntity, (hospital) => hospital.integracoesBanco, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'hospital_id',
    foreignKeyConstraintName: 'fk_integracao_hospital',
  })
  hospital!: HospitalOrmEntity;

  @ManyToOne(
    () => SistemaExternoOrmEntity,
    (sistemaExterno) => sistemaExterno.integracoesBanco,
  )
  @JoinColumn({
    name: 'sistema_externo_id',
    foreignKeyConstraintName: 'fk_integracao_sistema',
  })
  sistemaExterno!: SistemaExternoOrmEntity;
}
