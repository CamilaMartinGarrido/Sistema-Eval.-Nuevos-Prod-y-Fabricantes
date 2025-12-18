import { Module } from '@nestjs/common';
import { ManufacturerStatusService } from './manufacturer_status.service';
import { ManufacturerStatusController } from './manufacturer_status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturerStatusEntity } from './manufacturer_status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManufacturerStatusEntity])],
  providers: [ManufacturerStatusService],
  controllers: [ManufacturerStatusController],
})
export class ManufacturerStatusModule {}
