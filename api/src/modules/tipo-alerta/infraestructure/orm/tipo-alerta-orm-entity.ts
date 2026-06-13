import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AlertaOrmEntity } from '../../../alerta/infraestructure/orm/alerta-orm-entity';

@Entity('tipo_alerta')
export class TipoAlertaOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  descricao!: string;

  @OneToMany(() => AlertaOrmEntity, (alerta) => alerta.tipoAlerta)
  alertas?: AlertaOrmEntity[];
}
