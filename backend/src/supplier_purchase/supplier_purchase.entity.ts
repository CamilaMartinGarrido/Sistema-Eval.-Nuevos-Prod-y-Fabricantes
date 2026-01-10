import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';

//@Unique(['supply'])
@Entity({ name: 'supplier_purchase' })
export class SupplierPurchaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.supplier_purchases, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => CommercialEntityEntity, (supplier) => supplier.supplier_purchases, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: CommercialEntityEntity;

  @Column({ type: 'numeric' })
  unit_price: number;

  @Column({ type: 'date' })
  purchase_date: string;

  @OneToMany(() => ExploratoryOfferEntity, offer => offer.reference_purchase)
  exploratory_offers: ExploratoryOfferEntity[];
}
