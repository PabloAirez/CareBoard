import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DemandaOrmEntity } from '../../../demanda/infraestructure/orm/demanda-orm-entity';

@Entity('tipo_demanda')
export class TipoDemandaOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  descricao!: string;

  @OneToMany(() => DemandaOrmEntity, (demanda) => demanda.tipoDemanda)
  demandas?: DemandaOrmEntity[];
}
