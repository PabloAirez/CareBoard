import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InternacaoOrmEntity } from '../../../internacao/infraestructure/orm/internacao-orm-entity';
import { SinaisVitaisOrmEntity } from '../../../sinais-vitais/infraestructure/orm/sinais-vitais-orm-entity';

@Entity('paciente')
export class PacienteOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  nome!: string;

  @Column({ name: 'data_nascimento', type: 'date', nullable: true })
  dataNascimento?: Date | null;

  @Column({ type: 'char', length: 1, nullable: true })
  sexo?: string | null;

  @Column({ name: 'tem_doenca_contagiosa', type: 'boolean', default: false })
  temDoencaContagiosa!: boolean;

  @OneToMany(() => InternacaoOrmEntity, (internacao) => internacao.paciente)
  internacoes?: InternacaoOrmEntity[];

  @OneToMany(
    () => SinaisVitaisOrmEntity,
    (sinaisVitais) => sinaisVitais.paciente,
  )
  sinaisVitais?: SinaisVitaisOrmEntity[];
}
