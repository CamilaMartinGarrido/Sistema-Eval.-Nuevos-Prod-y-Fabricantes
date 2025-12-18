import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ResultIndustrialAnalysisEnum } from '../enums';

@Entity({ name: 'industrial_evaluation' })
export class IndustrialEvaluationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  industrial_purchase_id: number;

  @Column({ type: 'date', nullable: true })
  send_batch_date: string;

  @Column({ type: 'date', nullable: true })
  reception_batch_date: string;

  @Column({
    type: 'enum',
    enum: ResultIndustrialAnalysisEnum,
    enumName: 'result_industrial_analysis_enum',
    nullable: false,
  })
  analysis_result: ResultIndustrialAnalysisEnum;

  @Column({ type: 'date', nullable: true })
  report_delivery_date: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
