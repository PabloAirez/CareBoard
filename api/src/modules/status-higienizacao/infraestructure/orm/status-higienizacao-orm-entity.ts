import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HigienizacaoOrmEntity } from '../../../higienizacao/infraestructure/orm/higienizacao-orm-entity';

@Entity('status_higienizacao')
export class StatusHigienizacaoOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  descricao!: string;

  @OneToMany(
    () => HigienizacaoOrmEntity,
    (higienizacao) => higienizacao.statusHigienizacao,
  )
  higienizacoes?: HigienizacaoOrmEntity[];
}
