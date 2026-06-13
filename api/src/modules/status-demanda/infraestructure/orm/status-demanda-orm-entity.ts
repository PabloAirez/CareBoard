import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DemandaOrmEntity } from '../../../demanda/infraestructure/orm/demanda-orm-entity';

@Entity('status_demanda')
export class StatusDemandaOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  descricao!: string;

  @OneToMany(() => DemandaOrmEntity, (demanda) => demanda.statusDemanda)
  demandas?: DemandaOrmEntity[];
}
