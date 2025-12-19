import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'sample' })
export class SampleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  supply_id: number;

  @Column({ type: 'date', nullable: true })
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
}
