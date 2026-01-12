import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, Unique, OneToMany, Index } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';
import { DocumentEvaluationEntity } from '../document_evaluation/document_evaluation.entity';
import { SampleEvaluationEntity } from '../sample_evaluation/sample_evaluation.entity';
import { IndustrialPurchaseEntity } from '../industrial_purchase/industrial_purchase.entity';

@Unique(['application', 'supply'])
@Index('idx_evaluation_process_app', ['application'])
@Index('idx_evaluation_process_supply', ['supply'])
@Entity({ name: 'evaluation_process' })
export class EvaluationProcessEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => ApplicationEntity, (app) => app.evaluations, {
    eager: true,        
    nullable: false,     
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;

  @ManyToOne(() => SupplyEntity, (supply) => supply.evaluations, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @OneToMany(() => ExploratoryOfferEntity, offer => offer.evaluation_process)
  exploratory_offers: ExploratoryOfferEntity[];

  @OneToMany(() => DocumentEvaluationEntity, document => document.evaluation_process)
  document_evals: DocumentEvaluationEntity[];

  @OneToMany(() => SampleEvaluationEntity, evaluation => evaluation.evaluation_process)
  sample_evaluations: SampleEvaluationEntity[];

  @OneToMany(() => IndustrialPurchaseEntity, purchase => purchase.evaluation_process)
  industrial_purchases: IndustrialPurchaseEntity[];
}
