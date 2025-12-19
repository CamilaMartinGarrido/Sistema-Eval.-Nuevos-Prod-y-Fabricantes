import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { StateIndustrialPurchasingEnum } from '../enums';

@Entity({ name: 'industrial_purchase' })
export class IndustrialPurchaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  client_supply_id: number;

  @Column({ type: 'date' })
  request_date: string;

  @Column({
    type: 'enum',
    enum: StateIndustrialPurchasingEnum,
    enumName: 'state_industrial_purchasing_enum',
    nullable: false,
  })
  purchase_status: StateIndustrialPurchasingEnum;
}
