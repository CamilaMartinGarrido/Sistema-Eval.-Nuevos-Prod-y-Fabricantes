import { Entity, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { SampleEvaluationEntity } from '../sample_evaluation/sample_evaluation.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Unique(['sample_evaluation', 'observation'])
@Entity({ name: 'sample_evaluation_observation' })
export class SampleEvaluationObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SampleEvaluationEntity, (evaluation) => evaluation.sample_evaluation_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sample_evaluation_id' })
  sample_evaluation: SampleEvaluationEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.sample_analysis_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
