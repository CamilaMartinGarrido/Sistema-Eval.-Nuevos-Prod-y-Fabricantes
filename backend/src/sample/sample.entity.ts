import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { SupplyEntity } from 'src/supply/supply.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';
import { SampleEvaluationEntity } from '../sample_evaluation/sample_evaluation.entity';

@Unique(['sample_code'])
@Unique(['supply', 'request_date', 'quantity', 'unit'])
@Index('idx_sample_process', ['supply'])
@Index('idx_sample_request_date', ['request_date'])
@Index('idx_sample_receipt_client', ['date_receipt_client'])
@Index('idx_sample_code', ['sample_code'])
@Entity({ name: 'sample' })
export class SampleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SupplyEntity, (supply) => supply.samples, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @Column({ type: 'date' })
  request_date: string;

  @Column({ type: 'date', nullable: true })
  send_date_supplier: string;

  @Column({ type: 'date', nullable: true })
  date_receipt_warehouse: string;

  @Column({ type: 'date', nullable: true })
  date_receipt_client: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  quantity: string;

  @Column({ type: 'varchar' })
  unit: string;

  @Column({ type: 'varchar' })
  sample_code: string;

  @OneToMany(() => SampleAnalysisEntity, analysis => analysis.sample)
  sample_analyses: SampleAnalysisEntity[];

  @OneToMany(() => SampleEvaluationEntity, evaluation => evaluation.sample_analysis)
  sample_evaluations: SampleEvaluationEntity[];
}
