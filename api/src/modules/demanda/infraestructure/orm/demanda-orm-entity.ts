import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InternacaoOrmEntity } from '../../../internacao/infraestructure/orm/internacao-orm-entity';
import { StatusDemandaOrmEntity } from '../../../status-demanda/infraestructure/orm/status-demanda-orm-entity';
import { TipoDemandaOrmEntity } from '../../../tipo-demanda/infraestructure/orm/tipo-demanda-orm-entity';
import { UsuarioOrmEntity } from '../../../usuario/infraestructure/orm/usuario-orm-entity';

@Entity('demanda')
@Index('idx_demanda_internacao', ['internacaoId'])
export class DemandaOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'internacao_id', type: 'int' })
  internacaoId!: number;

  @Column({ name: 'tipo_demanda_id', type: 'int' })
  tipoDemandaId!: number;

  @Column({ name: 'status_demanda_id', type: 'int' })
  statusDemandaId!: number;

  @Column({ name: 'data_hora_solicitacao', type: 'timestamp' })
  dataHoraSolicitacao!: Date;

  @Column({ name: 'data_hora_atendimento', type: 'timestamp', nullable: true })
  dataHoraAtendimento?: Date | null;

  @Column({ name: 'atendido_por_usuario_id', type: 'int', nullable: true })
  atendidoPorUsuarioId?: number | null;

  @ManyToOne(() => InternacaoOrmEntity, (internacao) => internacao.demandas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'internacao_id',
    foreignKeyConstraintName: 'fk_demanda_internacao',
  })
  internacao!: InternacaoOrmEntity;

  @ManyToOne(() => TipoDemandaOrmEntity, (tipoDemanda) => tipoDemanda.demandas)
  @JoinColumn({
    name: 'tipo_demanda_id',
    foreignKeyConstraintName: 'fk_demanda_tipo',
  })
  tipoDemanda!: TipoDemandaOrmEntity;

  @ManyToOne(
    () => StatusDemandaOrmEntity,
    (statusDemanda) => statusDemanda.demandas,
  )
  @JoinColumn({
    name: 'status_demanda_id',
    foreignKeyConstraintName: 'fk_demanda_status',
  })
  statusDemanda!: StatusDemandaOrmEntity;

  @ManyToOne(() => UsuarioOrmEntity, (usuario) => usuario.demandasAtendidas, {
    nullable: true,
  })
  @JoinColumn({
    name: 'atendido_por_usuario_id',
    foreignKeyConstraintName: 'fk_demanda_usuario',
  })
  atendidoPorUsuario?: UsuarioOrmEntity | null;
}
