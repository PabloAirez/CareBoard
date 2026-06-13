import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InternacaoOrmEntity } from '../../../internacao/infraestructure/orm/internacao-orm-entity';

@Entity('status_internacao')
export class StatusInternacaoOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  descricao!: string;

  @OneToMany(
    () => InternacaoOrmEntity,
    (internacao) => internacao.statusInternacao,
  )
  internacoes?: InternacaoOrmEntity[];
}
