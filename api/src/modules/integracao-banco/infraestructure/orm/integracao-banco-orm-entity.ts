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

  @Column({ name: 'caminho_env', type: 'text' })
  caminhoEnv!: string;

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
