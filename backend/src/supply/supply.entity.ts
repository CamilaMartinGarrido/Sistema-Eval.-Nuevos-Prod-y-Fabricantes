import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Unique, Index, OneToOne } from 'typeorm';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';
import { SampleEntity } from '../sample/sample.entity';

@Unique(['supplier_entity', 'maker_product'])
@Entity({ name: 'supply' })
@Index('idx_supply_supplier', ['supplier_entity'])
@Index('idx_supply_maker_product', ['maker_product'])
export class SupplyEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => CommercialEntityEntity, (commercialEntity) => commercialEntity.supplies, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supplier_entity_id' })
  supplier_entity: CommercialEntityEntity;

  @ManyToOne(() => MakerProductEntity, (makerProduct) => makerProduct.supplies, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'maker_product_id' })
  maker_product: MakerProductEntity;

  @OneToOne(() => EvaluationProcessEntity, (evaluation) => evaluation.application)
  evaluations: EvaluationProcessEntity;

  @OneToMany(() => TechnicalDocumentEntity, document => document.supply)
  technical_documents: TechnicalDocumentEntity[];

  @OneToMany(() => SampleEntity, sample => sample.supply)
  samples: SampleEntity[];
}
