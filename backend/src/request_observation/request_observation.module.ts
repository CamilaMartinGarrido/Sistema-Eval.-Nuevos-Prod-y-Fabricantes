import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestObservationService } from './request_observation.service';
import { RequestObservationController } from './request_observation.controller';
import { RequestObservationEntity } from './request_observation.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ObservationEntity } from '../observation/observation.entity';
import { ObservationModule } from '../observation/observation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestObservationEntity,
      ApplicationEntity,
      ObservationEntity]
    ),
    ObservationModule,
  ],
  providers: [RequestObservationService],
  controllers: [RequestObservationController],
})
export class RequestObservationModule {}
