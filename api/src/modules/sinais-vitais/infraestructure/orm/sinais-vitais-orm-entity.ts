import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PacienteOrmEntity } from '../../../paciente/infraestructure/orm/paciente-orm-entity';

@Entity('sinais_vitais')
@Index('idx_sinais_paciente', ['pacienteId'])
export class SinaisVitaisOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'paciente_id', type: 'int' })
  pacienteId!: number;

  @Column({ name: 'data_hora', type: 'timestamp' })
  dataHora!: Date;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  oximetria?: string | null;

  @Column({ name: 'usa_suporte_oxigenio', type: 'boolean', nullable: true })
  usaSuporteOxigenio?: boolean | null;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperatura?: string | null;

  @Column({ name: 'frequencia_cardiaca', type: 'int', nullable: true })
  frequenciaCardiaca?: number | null;

  @Column({ name: 'frequencia_respiratoria', type: 'int', nullable: true })
  frequenciaRespiratoria?: number | null;

  @Column({ name: 'pressao_sistolica', type: 'int', nullable: true })
  pressaoSistolica?: number | null;

  @Column({ name: 'pressao_diastolica', type: 'int', nullable: true })
  pressaoDiastolica?: number | null;

  @Column({
    name: 'nivel_consciencia',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nivelConsciencia?: string | null;

  @Column({ name: 'mews_score', type: 'int', nullable: true })
  mewsScore?: number | null;

  @Column({ name: 'id_sistema_externo', type: 'varchar', length: 100, nullable: true })
  idSistemaExterno?: string | null;

  @ManyToOne(() => PacienteOrmEntity, (paciente) => paciente.sinaisVitais, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'paciente_id',
    foreignKeyConstraintName: 'fk_sinais_paciente',
  })
  paciente!: PacienteOrmEntity;
}
