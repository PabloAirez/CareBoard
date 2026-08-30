import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlertaOrmEntity } from '../../../alerta/infraestructure/orm/alerta-orm-entity';
import { DemandaOrmEntity } from '../../../demanda/infraestructure/orm/demanda-orm-entity';
import { LeitoOrmEntity } from '../../../leito/infraestructure/orm/leito-orm-entity';
import { PacienteOrmEntity } from '../../../paciente/infraestructure/orm/paciente-orm-entity';
import { StatusInternacaoOrmEntity } from '../../../status-internacao/infraestructure/orm/status-internacao-orm-entity';

@Entity('internacao')
@Index('idx_internacao_paciente', ['pacienteId'])
@Index('idx_internacao_leito', ['leitoId'])
export class InternacaoOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'paciente_id', type: 'int' })
  pacienteId!: number;

  @Column({ name: 'leito_id', type: 'int' })
  leitoId!: number;

  @Column({ name: 'data_entrada', type: 'timestamp' })
  dataEntrada!: Date;

  @Column({ name: 'data_saida', type: 'timestamp', nullable: true })
  dataSaida?: Date | null;

  @Column({ name: 'status_internacao_id', type: 'int' })
  statusInternacaoId!: number;

  @Column({ name: 'id_sistema_externo', type: 'varchar', length: 100, nullable: true })
  idSistemaExterno?: string | null;

  @ManyToOne(() => PacienteOrmEntity, (paciente) => paciente.internacoes)
  @JoinColumn({
    name: 'paciente_id',
    foreignKeyConstraintName: 'fk_internacao_paciente',
  })
  paciente!: PacienteOrmEntity;

  @ManyToOne(() => LeitoOrmEntity, (leito) => leito.internacoes)
  @JoinColumn({
    name: 'leito_id',
    foreignKeyConstraintName: 'fk_internacao_leito',
  })
  leito!: LeitoOrmEntity;

  @ManyToOne(
    () => StatusInternacaoOrmEntity,
    (statusInternacao) => statusInternacao.internacoes,
  )
  @JoinColumn({
    name: 'status_internacao_id',
    foreignKeyConstraintName: 'fk_internacao_status',
  })
  statusInternacao!: StatusInternacaoOrmEntity;

  @OneToMany(() => DemandaOrmEntity, (demanda) => demanda.internacao)
  demandas?: DemandaOrmEntity[];

  @OneToMany(() => AlertaOrmEntity, (alerta) => alerta.internacao)
  alertas?: AlertaOrmEntity[];
}
