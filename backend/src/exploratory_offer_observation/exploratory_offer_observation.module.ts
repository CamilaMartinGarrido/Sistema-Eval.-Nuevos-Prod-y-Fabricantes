import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExploratoryOfferObservationService } from './exploratory_offer_observation.service';
import { ExploratoryOfferObservationController } from './exploratory_offer_observation.controller';
import { ExploratoryOfferObservationEntity } from './exploratory_offer_observation.entity';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';
import { ObservationEntity } from '../observation/observation.entity';
import { ObservationModule } from 'src/observation/observation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExploratoryOfferObservationEntity, 
      ExploratoryOfferEntity, 
      ObservationEntity]
    ),
    ObservationModule,
  ],
  providers: [ExploratoryOfferObservationService],
  controllers: [ExploratoryOfferObservationController],
})
export class ExploratoryOfferObservationModule {}
