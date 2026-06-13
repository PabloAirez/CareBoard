import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IntegracaoBancoOrmEntity } from '../../../integracao-banco/infraestructure/orm/integracao-banco-orm-entity';
import { UnidadeOrmEntity } from '../../../unidade/infraestructure/orm/unidade-orm-entity';
import { UsuarioOrmEntity } from '../../../usuario/infraestructure/orm/usuario-orm-entity';

@Entity('hospital')
export class HospitalOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 255,
  })
  nome!: string;

  @Column({
    unique: true,
    length: 18,
  })
  cnpj!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  endereco?: string;

  @OneToMany(() => UnidadeOrmEntity, (unidade) => unidade.hospital)
  unidades?: UnidadeOrmEntity[];

  @OneToMany(() => UsuarioOrmEntity, (usuario) => usuario.hospital)
  usuarios?: UsuarioOrmEntity[];

  @OneToMany(
    () => IntegracaoBancoOrmEntity,
    (integracao) => integracao.hospital,
  )
  integracoesBanco?: IntegracaoBancoOrmEntity[];
}
