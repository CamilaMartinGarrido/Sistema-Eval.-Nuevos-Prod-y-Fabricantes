import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'sample_evaluation' })
export class SampleEvaluationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  client_supply_id: number;

  @Column({ type: 'int' })
  sample_id: number;

  @Column({ type: 'int' })
  sample_analysis_id: number;

  @Column({ type: 'boolean' })
  self_performed: boolean;

  @Column({ type: 'int', nullable: true })
  source_client: number;

  @Column({ type: 'boolean', nullable: true })
  decision_continue: boolean;
}
