import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FinalStateManufacturerEnum } from '../enums';
import { MakerProductEntity } from '../maker_product/maker_product.entity';

@Entity({ name: 'manufacturer_status' })
export class ManufacturerStatusEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => MakerProductEntity, (maker_product) => maker_product.manufacturer_states, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'maker_product_id' })
  maker_product: MakerProductEntity;

  @Column({ type: 'date' }) 
  start_date: string;

  @Column({
    type: 'enum',
    enum: FinalStateManufacturerEnum,
    enumName: 'final_state_manufacturer_enum',
  })
  final_state: FinalStateManufacturerEnum;

  @Column({ type: 'date' })
  end_date: string;
}
