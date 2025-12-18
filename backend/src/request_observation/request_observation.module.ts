import { Module } from '@nestjs/common';
import { RequestObservationService } from './request_observation.service';
import { RequestObservationController } from './request_observation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestObservationEntity } from './request_observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestObservationEntity])],
  providers: [RequestObservationService],
  controllers: [RequestObservationController],
})
export class RequestObservationModule {}
