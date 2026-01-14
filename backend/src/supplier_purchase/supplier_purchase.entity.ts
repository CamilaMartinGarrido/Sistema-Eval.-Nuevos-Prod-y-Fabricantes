import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Unique, Index } from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';

@Unique('uq_supplier_purchase', ['product', 'supplier', 'purchase_date'])
@Index('idx_supp_purchase_product', ['product'])
@Index('idx_supp_purchase_supplier', ['supplier'])
@Index('idx_supp_purchase_date', ['purchase_date'])
@Index('idx_supp_purchase_price', ['unit_price'])
@Entity({ name: 'supplier_purchase' })
export class SupplierPurchaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.supplier_purchases, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => CommercialEntityEntity, (supplier) => supplier.supplier_purchases, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: CommercialEntityEntity;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: false,
  })
  unit_price: string;

  @Column({ type: 'date', nullable: false })
  purchase_date: string;

  @OneToMany(() => ExploratoryOfferEntity, offer => offer.reference_purchase)
  exploratory_offers: ExploratoryOfferEntity[];
}
