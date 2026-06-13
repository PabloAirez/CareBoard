import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LeitoOrmEntity } from '../../../leito/infraestructure/orm/leito-orm-entity';

@Entity('status_leito')
export class StatusLeitoOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  descricao!: string;

  @OneToMany(() => LeitoOrmEntity, (leito) => leito.statusLeito)
  leitos?: LeitoOrmEntity[];
}
