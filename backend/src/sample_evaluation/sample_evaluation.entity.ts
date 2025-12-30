import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';
import { ClientEntity } from '../client/client.entity';
import { SampleEvaluationObservationEntity } from '../sample_evaluation_observation/sample_evaluation_observation.entity';

@Unique(['client_supply', 'sample_analysis'])
@Entity({ name: 'sample_evaluation' })
export class SampleEvaluationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ClientSupplyEntity, (client_supply) => client_supply.sample_evaluations, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'client_supply_id' })
  client_supply: ClientSupplyEntity;

  @ManyToOne(() => SampleAnalysisEntity, (sample_analysis) => sample_analysis.sample_evaluations, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sample_analysis_id' })
  sample_analysis: SampleAnalysisEntity;

  @Column({ type: 'boolean' })
  self_performed: boolean;

  @ManyToOne(() => ClientEntity, (client) => client.sample_evaluations, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'source_client' })
  source_client: ClientEntity;

  @Column({ type: 'boolean', nullable: true })
  decision_continue: boolean;

  @OneToMany(() => SampleEvaluationObservationEntity, (sample_evaluation_observ) => sample_evaluation_observ.sample_evaluation)
  sample_evaluation_observs: SampleEvaluationObservationEntity[];
}
