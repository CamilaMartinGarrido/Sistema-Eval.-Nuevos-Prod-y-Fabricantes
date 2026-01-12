import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Unique, Index } from 'typeorm';
import { ExploratoryOfferObservationEntity } from '../exploratory_offer_observation/exploratory_offer_observation.entity';
import { EvaluationProcessEntity } from 'src/evaluation_process/';
import { SupplierPurchaseEntity } from 'src/supplier_purchase/supplier_purchase.entity';

@Unique(['evaluation_process'])
@Index('idx_exploratory_eval_process', ['evaluation_process'])
@Index('idx_exploratory_ref_purchase', ['reference_purchase'])
@Index('idx_exploratory_analysis_date', ['analysis_date'])
@Index('idx_exploratory_competitive', ['is_competitive'], {
  where: `"is_competitive" = true`
})
@Entity({ name: 'exploratory_offer' })
export class ExploratoryOfferEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => EvaluationProcessEntity, (evaluation) => evaluation.exploratory_offers, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evaluation_process_id' })
  evaluation_process: EvaluationProcessEntity;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  offered_price: string;

  @ManyToOne(() => SupplierPurchaseEntity, (purchase) => purchase.exploratory_offers, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'reference_purchase_id' })
  reference_purchase: SupplierPurchaseEntity;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  price_difference: string;

  @Column({
    type: 'numeric',
    precision: 6,
    scale: 2,
  })
  percentage_difference: string;

  @Column({ type: 'date' })
  analysis_date: string;

  @Column({ type: 'boolean' })
  is_competitive: boolean;

  @OneToMany(() => ExploratoryOfferObservationEntity, (exp_offer_observ) => exp_offer_observ.exploratory_offer)
  exploratory_offer_observs: ExploratoryOfferObservationEntity[];
}
