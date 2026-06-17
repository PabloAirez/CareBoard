import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlertaOrmEntity } from '../../../alerta/infraestructure/orm/alerta-orm-entity';
import { DemandaOrmEntity } from '../../../demanda/infraestructure/orm/demanda-orm-entity';
import { HigienizacaoOrmEntity } from '../../../higienizacao/infraestructure/orm/higienizacao-orm-entity';
import { HospitalOrmEntity } from '../../../hospital/infraestructure/orm/hospital-orm-entity';
import { TipoUsuarioOrmEntity } from '../../../tipo-usuario/infraestructure/orm/tipo-usuario-orm-entity';

@Entity('usuario')
export class UsuarioOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  nome!: string;

  @Column({ length: 255, default: '123456' })
  senha!: string;

  @Column({ name: 'tipo_usuario_id', type: 'int' })
  tipoUsuarioId!: number;

  @Column({ name: 'hospital_id', type: 'int' })
  hospitalId!: number;

  @ManyToOne(() => TipoUsuarioOrmEntity, (tipoUsuario) => tipoUsuario.usuarios)
  @JoinColumn({
    name: 'tipo_usuario_id',
    foreignKeyConstraintName: 'fk_usuario_tipo',
  })
  tipoUsuario!: TipoUsuarioOrmEntity;

  @ManyToOne(() => HospitalOrmEntity, (hospital) => hospital.usuarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'hospital_id',
    foreignKeyConstraintName: 'fk_usuario_hospital',
  })
  hospital!: HospitalOrmEntity;

  @OneToMany(() => DemandaOrmEntity, (demanda) => demanda.atendidoPorUsuario)
  demandasAtendidas?: DemandaOrmEntity[];

  @OneToMany(() => AlertaOrmEntity, (alerta) => alerta.vistoPorUsuario)
  alertasVistos?: AlertaOrmEntity[];

  @OneToMany(
    () => HigienizacaoOrmEntity,
    (higienizacao) => higienizacao.realizadoPorUsuario,
  )
  higienizacoesRealizadas?: HigienizacaoOrmEntity[];
}
