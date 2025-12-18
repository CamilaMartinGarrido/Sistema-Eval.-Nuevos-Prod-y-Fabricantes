import { Module } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplyEntity } from './supply.entity';
import { SupplierEntity } from '../supplier/supplier.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplyEntity, SupplierEntity, MakerProductEntity])
  ],
  providers: [SupplyService],
  controllers: [SupplyController],
})
export class SupplyModule {}
