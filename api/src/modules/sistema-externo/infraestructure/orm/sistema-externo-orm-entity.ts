import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IntegracaoBancoOrmEntity } from '../../../integracao-banco/infraestructure/orm/integracao-banco-orm-entity';

@Entity('sistema_externo')
export class SistemaExternoOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  nome!: string;

  @OneToMany(
    () => IntegracaoBancoOrmEntity,
    (integracao) => integracao.sistemaExterno,
  )
  integracoesBanco?: IntegracaoBancoOrmEntity[];
}
