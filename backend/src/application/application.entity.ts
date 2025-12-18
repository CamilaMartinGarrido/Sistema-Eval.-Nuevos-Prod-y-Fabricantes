import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OriginRequestEnum } from '../enums';
import { ClientEntity } from '../client/client.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'application' })
export class ApplicationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  application_number: number;

  @ManyToOne(() => ClientEntity, (client) => client.applications, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => ProductEntity, (product) => product.applications, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({
    type: 'enum',
    enum: OriginRequestEnum,
    enumName: 'origin_request_enum',
    nullable: false,
  })
  origin: OriginRequestEnum;

  @Column({ type: 'date' })
  receipt_date: string;

  @Column({ type: 'boolean', nullable: true })
  is_selected: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at_Application: Date;
}
