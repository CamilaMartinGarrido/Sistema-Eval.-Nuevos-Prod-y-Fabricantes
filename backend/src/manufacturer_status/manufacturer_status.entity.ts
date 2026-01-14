import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { EvaluationStateManufacturerEnum } from '../enums';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';

@Index('uq_manufacturer_status_active_per_process', ['maker_product', 'evaluation_process'], { unique: true, where: 'end_date IS NULL AND evaluation_process IS NOT NULL' })
@Index('uq_manufacturer_status_global_active', ['maker_product'], { unique: true, where: 'end_date IS NULL AND evaluation_process IS NULL' })
@Index('idx_manufacturer_status_maker_product', ['maker_product'])
@Index('idx_manufacturer_status_process', ['evaluation_process'])
@Index('idx_manufacturer_status_dates', ['start_date', 'end_date'])
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

  @Column({ type: 'date', nullable: false }) 
  start_date: string;

  @Column({
    type: 'enum',
    enum: EvaluationStateManufacturerEnum,
    enumName: 'evaluation_state_manufacturer_enum',
    nullable: false,
  })
  evaluation_state: EvaluationStateManufacturerEnum;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @ManyToOne(() => EvaluationProcessEntity, (evaluation) => evaluation.manufacturer_states, {
    eager: true,
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evaluation_process_id' })
  evaluation_process: EvaluationProcessEntity;
}
