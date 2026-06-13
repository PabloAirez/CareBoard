import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LeitoOrmEntity } from '../../../leito/infraestructure/orm/leito-orm-entity';
import { StatusHigienizacaoOrmEntity } from '../../../status-higienizacao/infraestructure/orm/status-higienizacao-orm-entity';
import { UsuarioOrmEntity } from '../../../usuario/infraestructure/orm/usuario-orm-entity';

@Entity('higienizacao')
@Index('idx_higienizacao_leito', ['leitoId'])
export class HigienizacaoOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'leito_id', type: 'int' })
  leitoId!: number;

  @Column({ name: 'status_higienizacao_id', type: 'int' })
  statusHigienizacaoId!: number;

  @Column({ name: 'data_inicio', type: 'timestamp' })
  dataInicio!: Date;

  @Column({ name: 'data_fim', type: 'timestamp', nullable: true })
  dataFim?: Date | null;

  @Column({ name: 'realizado_por_usuario_id', type: 'int', nullable: true })
  realizadoPorUsuarioId?: number | null;

  @ManyToOne(() => LeitoOrmEntity, (leito) => leito.higienizacoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'leito_id',
    foreignKeyConstraintName: 'fk_higienizacao_leito',
  })
  leito!: LeitoOrmEntity;

  @ManyToOne(
    () => StatusHigienizacaoOrmEntity,
    (statusHigienizacao) => statusHigienizacao.higienizacoes,
  )
  @JoinColumn({
    name: 'status_higienizacao_id',
    foreignKeyConstraintName: 'fk_higienizacao_status',
  })
  statusHigienizacao!: StatusHigienizacaoOrmEntity;

  @ManyToOne(
    () => UsuarioOrmEntity,
    (usuario) => usuario.higienizacoesRealizadas,
    {
      nullable: true,
    },
  )
  @JoinColumn({
    name: 'realizado_por_usuario_id',
    foreignKeyConstraintName: 'fk_higienizacao_usuario',
  })
  realizadoPorUsuario?: UsuarioOrmEntity | null;
}
