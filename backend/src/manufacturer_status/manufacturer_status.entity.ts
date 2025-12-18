import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { FinalStateManufacturerEnum } from '../enums';

@Entity({ name: 'manufacturer_status' })
export class ManufacturerStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  maker_product_id: number;

  @Column({ type: 'date' })
  status_date: string;

  @Column({
    type: 'enum',
    enum: FinalStateManufacturerEnum,
    enumName: 'final_state_manufacturer_enum',
  })
  final_state: FinalStateManufacturerEnum;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
