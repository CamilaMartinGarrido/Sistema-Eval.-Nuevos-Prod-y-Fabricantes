import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'sample_evaluation_observation' })
export class SampleEvaluationObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  sample_evaluation_id: number;

  @Column({ type: 'int' })
  observation_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
