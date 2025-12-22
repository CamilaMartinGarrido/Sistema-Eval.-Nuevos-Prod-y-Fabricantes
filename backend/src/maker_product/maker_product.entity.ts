import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { ProductEntity } from '../product/product.entity';
import { SupplyEntity } from '../supply/supply.entity';

@Unique(['product', 'maker_entity'])
@Entity({ name: 'maker_product' })
export class MakerProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.maker_products, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => CommercialEntityEntity, (ce) => ce.maker_products, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'maker_entity_id' })
  maker_entity: CommercialEntityEntity;

  @OneToMany(() => SupplyEntity, (supply) => supply.maker_product)
  supplies: SupplyEntity[];
}
