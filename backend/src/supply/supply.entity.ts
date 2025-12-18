import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { SupplierEntity } from '../supplier/supplier.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';

@Entity({ name: 'supply' })
export class SupplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.supplies, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: SupplierEntity;
    
  @ManyToOne(() => MakerProductEntity, (maker_product) => maker_product.supplies, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'maker_product_id' })
  maker_product: MakerProductEntity;

  @CreateDateColumn({ type: 'timestamp' })
  created_at_Supply: Date;

  @OneToMany(() => ClientSupplyEntity, (client_supply) => client_supply.supply)
    client_supplies: ClientSupplyEntity[];
  
  @OneToMany(() => ExploratoryOfferEntity, (offer) => offer.supply)
    exploratory_offers: ExploratoryOfferEntity[];
  
  @OneToMany(() => TechnicalDocumentEntity, (document) => document.supply)
    technicalDocuments: TechnicalDocumentEntity[];
}
