import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierPurchaseEntity } from './supplier_purchase.entity';
import { SupplierPurchaseService } from './supplier_purchase.service';
import { SupplierPurchaseController } from './supplier_purchase.controller';
import { ProductEntity } from '../product/product.entity';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierPurchaseEntity, ProductEntity, CommercialEntityEntity])],
  providers: [SupplierPurchaseService],
  controllers: [SupplierPurchaseController],
})
export class SupplierPurchaseModule {}
