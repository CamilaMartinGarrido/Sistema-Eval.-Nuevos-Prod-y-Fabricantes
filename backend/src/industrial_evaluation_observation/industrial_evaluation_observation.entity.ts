import { Entity, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IndustrialEvaluationEntity } from '../industrial_evaluation/industrial_evaluation.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Unique('uq_ie_obs', ['industrial_evaluation', 'observation'])
@Index('idx_ie_obs_evaluation', ['industrial_evaluation'])
@Index('idx_ie_obs_observation', ['observation'])
@Entity({ name: 'industrial_evaluation_observation' })
export class IndustrialEvaluationObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => IndustrialEvaluationEntity, (evaluation) => evaluation.industrial_evaluation_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'industrial_evaluation_id' })
  industrial_evaluation: IndustrialEvaluationEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.industrial_evaluation_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
