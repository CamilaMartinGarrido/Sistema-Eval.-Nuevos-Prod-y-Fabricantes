import { Module } from '@nestjs/common';
import { ManufacturerStatusService } from './manufacturer_status.service';
import { ManufacturerStatusController } from './manufacturer_status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturerStatusEntity } from './manufacturer_status.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManufacturerStatusEntity, MakerProductEntity, EvaluationProcessEntity])],
  providers: [ManufacturerStatusService],
  controllers: [ManufacturerStatusController],
})
export class ManufacturerStatusModule {}
