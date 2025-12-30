import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'sample_evaluation_observation' })
export class SampleEvaluationObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  sample_evaluation_id: number;

  @Column({ type: 'int' })
  observation_id: number;
}
