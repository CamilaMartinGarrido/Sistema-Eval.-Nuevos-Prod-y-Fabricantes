import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
import { SupplyEntity } from './supply.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { CommercialEntityModule } from '../commercial_entity/commercial_entity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplyEntity, CommercialEntityEntity, MakerProductEntity]),
    CommercialEntityModule,
  ],
  providers: [SupplyService],
  controllers: [SupplyController],
})
export class SupplyModule {}
