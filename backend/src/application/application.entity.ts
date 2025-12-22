import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany, Unique } from 'typeorm';
import { OriginRequestEnum } from '../enums';
import { ClientEntity } from '../client/client.entity';
import { ProductEntity } from '../product/product.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { RequestOfferEntity } from '../request_offer/request_offer.entity';
import { RequestObservationEntity } from '../request_observation/request_observation.entity';

@Unique(['application_number'])
@Unique(['client', 'product', 'receipt_date'])
@Entity({ name: 'application' })
export class ApplicationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  application_number: number;

  @ManyToOne(() => ClientEntity, (client) => client.applications, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => ProductEntity, (product) => product.applications, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({
    type: 'enum',
    enum: OriginRequestEnum,
    enumName: 'origin_request_enum',
    nullable: false,
  })
  origin: OriginRequestEnum;

  @Column({ type: 'date' })
  receipt_date: string;

  @Column({ type: 'boolean', nullable: true })
  is_selected: boolean;

  @OneToOne(() => ClientSupplyEntity, (clientSupply) => clientSupply.application)
  client_supply: ClientSupplyEntity;

  @OneToMany(() => RequestOfferEntity, request_offer => request_offer.application)
  request_offers: RequestOfferEntity[];

  @OneToMany(() => RequestObservationEntity, (request_observ) => request_observ.application)
  request_observs: RequestObservationEntity[];
}
