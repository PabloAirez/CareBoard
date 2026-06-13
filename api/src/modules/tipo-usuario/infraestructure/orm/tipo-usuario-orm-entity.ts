import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioOrmEntity } from '../../../usuario/infraestructure/orm/usuario-orm-entity';

@Entity('tipo_usuario')
export class TipoUsuarioOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  descricao!: string;

  @OneToMany(() => UsuarioOrmEntity, (usuario) => usuario.tipoUsuario)
  usuarios?: UsuarioOrmEntity[];
}
