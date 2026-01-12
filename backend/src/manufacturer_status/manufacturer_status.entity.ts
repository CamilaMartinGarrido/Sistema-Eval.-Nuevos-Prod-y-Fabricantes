import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { FinalStateManufacturerEnum } from '../enums';
import { MakerProductEntity } from '../maker_product/maker_product.entity';

@Unique(['maker_product', 'start_date'])
@Index('ux_manufacturer_status_active', ['maker_product'], {
  unique: true,
  where: `"end_date" IS NULL`,
})
@Index('idx_man_status_maker_product', ['maker_product'])

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

  @Column({ type: 'date', nullable: true })
  end_date: string;
}
