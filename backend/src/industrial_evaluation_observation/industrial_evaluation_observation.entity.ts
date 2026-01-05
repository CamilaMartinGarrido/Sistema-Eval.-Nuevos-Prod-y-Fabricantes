import { Entity, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { IndustrialEvaluationEntity } from '../industrial_evaluation/industrial_evaluation.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Unique(['industrial_evaluation', 'observation'])
@Entity({ name: 'industrial_evaluation_observation' })
export class IndustrialEvaluationObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => IndustrialEvaluationEntity, (evaluation) => evaluation.industrial_evaluation_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'industrial_evaluation_id' })
  industrial_evaluation: IndustrialEvaluationEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.industrial_evaluation_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
