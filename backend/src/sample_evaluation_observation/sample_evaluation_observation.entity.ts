import { Entity, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn, Index } from 'typeorm';
import { SampleEvaluationEntity } from '../sample_evaluation/sample_evaluation.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Unique('uq_se_obs', ['sample_evaluation', 'observation'])
@Index('idx_se_obs_evaluation', ['sample_evaluation'])
@Index('idx_se_obs_observation', ['observation'])
@Entity({ name: 'sample_evaluation_observation' })
export class SampleEvaluationObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SampleEvaluationEntity, (evaluation) => evaluation.sample_evaluation_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sample_evaluation_id' })
  sample_evaluation: SampleEvaluationEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.sample_analysis_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
