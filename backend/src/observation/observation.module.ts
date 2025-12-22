import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationService } from './observation.service';
import { ObservationController } from './observation.controller';
import { ObservationEntity } from './observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ObservationEntity])],
  providers: [ObservationService],
  controllers: [ObservationController],
  exports: [ObservationService]
})
export class ObservationModule {}
