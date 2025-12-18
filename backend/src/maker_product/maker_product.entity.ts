import { MakerEntity } from '../maker/maker.entity';
import { ProductEntity } from '../product/product.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn, 
  OneToMany,
} from 'typeorm';

@Entity({ name: 'maker_product' })
export class MakerProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.maker_products, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
  
  @ManyToOne(() => MakerEntity, (maker) => maker.maker_products, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'maker_id' })
  maker: MakerEntity;

  @OneToMany(() => SupplyEntity, (supply) => supply.maker_product)
    supplies: SupplyEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at_MakerProduct: Date;
}
