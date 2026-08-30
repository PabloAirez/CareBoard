import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HospitalOrmEntity } from '../../../hospital/infraestructure/orm/hospital-orm-entity';
import { LeitoOrmEntity } from '../../../leito/infraestructure/orm/leito-orm-entity';

@Entity('unidade')
export class UnidadeOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  nome!: string;

  @Column({ name: 'hospital_id', type: 'int' })
  hospitalId!: number;

  @Column({ name: 'id_sistema_externo', type: 'varchar', length: 100, nullable: true })
  idSistemaExterno?: string | null;

  @ManyToOne(() => HospitalOrmEntity, (hospital) => hospital.unidades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'hospital_id',
    foreignKeyConstraintName: 'fk_unidade_hospital',
  })
  hospital!: HospitalOrmEntity;

  @OneToMany(() => LeitoOrmEntity, (leito) => leito.unidade)
  leitos?: LeitoOrmEntity[];
}
