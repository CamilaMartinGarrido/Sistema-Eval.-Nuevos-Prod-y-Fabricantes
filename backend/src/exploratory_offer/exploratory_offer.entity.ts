import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { ExploratoryOfferObservationEntity } from '../exploratory_offer_observation/exploratory_offer_observation.entity';
import { RequestOfferEntity } from '../request_offer/request_offer.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { SupplierPurchaseEntity } from 'src/supplier_purchase/supplier_purchase.entity';

@Unique(['supply'])
@Entity({ name: 'exploratory_offer' })
export class ExploratoryOfferEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SupplyEntity, (supply) => supply.exploratory_offers, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @Column({ type: 'numeric' })
  offered_price: number;

  @ManyToOne(() => SupplierPurchaseEntity, (purchase) => purchase.exploratory_offers, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'reference_purchase_id' })
  reference_purchase: SupplierPurchaseEntity;

  @Column({ type: 'boolean', nullable: true })
  is_competitive: boolean;

  @Column({ type: 'numeric' })
  price_difference: number;

  @Column({ type: 'numeric' })
  percentage_difference: number;

  @Column({ type: 'date' })
  analysis_date: string;

  @OneToMany(() => ExploratoryOfferObservationEntity, (exp_offer_observ) => exp_offer_observ.exploratory_offer)
  exploratory_offer_observs: ExploratoryOfferObservationEntity[];

  @OneToMany(() => RequestOfferEntity, request_offer => request_offer.exploratory_offer)
  request_offers: RequestOfferEntity[];
}
