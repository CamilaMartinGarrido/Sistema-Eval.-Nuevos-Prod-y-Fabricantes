import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';

@Entity({ name: 'supply' })
export class SupplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CommercialEntityEntity, (commercialEntity) => commercialEntity.supplies, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supplier_entity_id' })
  supplier_entity: CommercialEntityEntity;

  @ManyToOne(() => MakerProductEntity, (makerProduct) => makerProduct.supplies, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'maker_product_id' })
  maker_product: MakerProductEntity;

  @OneToMany(() => ClientSupplyEntity, clientSupply => clientSupply.supply)
  client_supplies: ClientSupplyEntity[];

  @OneToMany(() => ExploratoryOfferEntity, offer => offer.supply)
  exploratory_offers: ExploratoryOfferEntity[];

  @OneToMany(() => TechnicalDocumentEntity, document => document.supply)
  technical_documents: TechnicalDocumentEntity[];
}
