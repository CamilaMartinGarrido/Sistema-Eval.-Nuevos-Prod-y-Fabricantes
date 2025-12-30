import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { SupplyEntity } from '../supply/supply.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';

@Unique(['supply', 'request_date', 'quantity', 'unit'])
@Entity({ name: 'sample' })
export class SampleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SupplyEntity, (supply) => supply.samples, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
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

  @Column({ type: 'numeric' })
  quantity: number;

  @Column({ type: 'varchar' })
  unit: string;

  @Column({ type: 'varchar' })
  sample_code: string;

  @OneToMany(() => SampleAnalysisEntity, analysis => analysis.sample)
  sample_analyses: SampleAnalysisEntity[];
}
