import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ResultSampleAnalysisEnum } from '../enums';

@Entity({ name: 'sample_analysis' })
export class SampleAnalysisEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  sample_id: number;

  @Column({ type: 'int' })
  performed_by_client: number;

  @Column({ type: 'date' })
  analysis_date: string;

  @Column({
    type: 'enum',
    enum: ResultSampleAnalysisEnum,
    enumName: 'result_sample_analysis_enum',
    nullable: false,
  })
  result: ResultSampleAnalysisEnum;
}
