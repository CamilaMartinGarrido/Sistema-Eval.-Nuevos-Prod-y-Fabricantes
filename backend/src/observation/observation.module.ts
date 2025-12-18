import { Module } from '@nestjs/common';
import { ObservationService } from './observation.service';
import { ObservationController } from './observation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationEntity } from './observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ObservationEntity])],
  providers: [ObservationService],
  controllers: [ObservationController],
  exports: [ObservationService]
})
export class ObservationModule {}
