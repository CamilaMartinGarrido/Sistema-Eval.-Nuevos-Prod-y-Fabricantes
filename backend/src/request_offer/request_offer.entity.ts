import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApplicationEntity } from 'src/application/application.entity';
import { ExploratoryOfferEntity } from 'src/exploratory_offer/exploratory_offer.entity';

@Entity({ name: 'request_offer' })
export class RequestOfferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ApplicationEntity, (app) => app.request_offers, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;

  @ManyToOne(() => ExploratoryOfferEntity, (offer) => offer.request_offers, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'exploratory_offer_id' })
  exploratory_offer: ExploratoryOfferEntity;
}
