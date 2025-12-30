import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleEntity } from './sample.entity';
import { SupplyEntity } from '../supply/supply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleEntity, SupplyEntity])],
  providers: [SampleService],
  controllers: [SampleController],
})
export class SampleModule {}
