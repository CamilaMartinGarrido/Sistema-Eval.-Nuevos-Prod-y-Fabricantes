import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'industrial_evaluation_observation' })
export class IndustrialEvaluationObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  industrial_evaluation_id: number;

  @Column({ type: 'int' })
  observation_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
