import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'sample_analysis_observation' })
export class SampleAnalysisObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  sample_analysis_id: number;

  @Column({ type: 'int' })
  observation_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
