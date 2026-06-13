import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InternacaoOrmEntity } from '../../../internacao/infraestructure/orm/internacao-orm-entity';
import { TipoAlertaOrmEntity } from '../../../tipo-alerta/infraestructure/orm/tipo-alerta-orm-entity';
import { UsuarioOrmEntity } from '../../../usuario/infraestructure/orm/usuario-orm-entity';

@Entity('alerta')
@Index('idx_alerta_internacao', ['internacaoId'])
export class AlertaOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'internacao_id', type: 'int' })
  internacaoId!: number;

  @Column({ name: 'tipo_alerta_id', type: 'int' })
  tipoAlertaId!: number;

  @Column({ type: 'text' })
  mensagem!: string;

  @Column({ name: 'data_hora', type: 'timestamp' })
  dataHora!: Date;

  @Column({ type: 'boolean', default: false })
  visto!: boolean;

  @Column({ name: 'visto_por_usuario_id', type: 'int', nullable: true })
  vistoPorUsuarioId?: number | null;

  @Column({ name: 'data_hora_visto', type: 'timestamp', nullable: true })
  dataHoraVisto?: Date | null;

  @ManyToOne(() => InternacaoOrmEntity, (internacao) => internacao.alertas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'internacao_id',
    foreignKeyConstraintName: 'fk_alerta_internacao',
  })
  internacao!: InternacaoOrmEntity;

  @ManyToOne(() => TipoAlertaOrmEntity, (tipoAlerta) => tipoAlerta.alertas)
  @JoinColumn({
    name: 'tipo_alerta_id',
    foreignKeyConstraintName: 'fk_alerta_tipo',
  })
  tipoAlerta!: TipoAlertaOrmEntity;

  @ManyToOne(() => UsuarioOrmEntity, (usuario) => usuario.alertasVistos, {
    nullable: true,
  })
  @JoinColumn({
    name: 'visto_por_usuario_id',
    foreignKeyConstraintName: 'fk_alerta_usuario',
  })
  vistoPorUsuario?: UsuarioOrmEntity | null;
}
