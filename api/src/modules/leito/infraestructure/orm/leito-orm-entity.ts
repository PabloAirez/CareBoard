import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HigienizacaoOrmEntity } from '../../../higienizacao/infraestructure/orm/higienizacao-orm-entity';
import { InternacaoOrmEntity } from '../../../internacao/infraestructure/orm/internacao-orm-entity';
import { StatusLeitoOrmEntity } from '../../../status-leito/infraestructure/orm/status-leito-orm-entity';
import { UnidadeOrmEntity } from '../../../unidade/infraestructure/orm/unidade-orm-entity';

@Entity('leito')
@Index('idx_leito_unidade', ['unidadeId'])
export class LeitoOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  numero!: string;

  @Column({ name: 'unidade_id', type: 'int' })
  unidadeId!: number;

  @Column({ name: 'status_leito_id', type: 'int' })
  statusLeitoId!: number;

  @Column({ name: 'id_sistema_externo', type: 'varchar', length: 100, nullable: true })
  idSistemaExterno?: string | null;

  @ManyToOne(() => UnidadeOrmEntity, (unidade) => unidade.leitos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'unidade_id',
    foreignKeyConstraintName: 'fk_leito_unidade',
  })
  unidade!: UnidadeOrmEntity;

  @ManyToOne(() => StatusLeitoOrmEntity, (statusLeito) => statusLeito.leitos)
  @JoinColumn({
    name: 'status_leito_id',
    foreignKeyConstraintName: 'fk_leito_status',
  })
  statusLeito!: StatusLeitoOrmEntity;

  @OneToMany(() => InternacaoOrmEntity, (internacao) => internacao.leito)
  internacoes?: InternacaoOrmEntity[];

  @OneToMany(() => HigienizacaoOrmEntity, (higienizacao) => higienizacao.leito)
  higienizacoes?: HigienizacaoOrmEntity[];
}
