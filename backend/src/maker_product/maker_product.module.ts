import { Module } from '@nestjs/common';
import { MakerProductService } from './maker_product.service';
import { MakerProductController } from './maker_product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MakerProductEntity } from './maker_product.entity';
import { ProductEntity } from '../product/product.entity';
import { MakerEntity } from '../maker/maker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MakerProductEntity, ProductEntity, MakerEntity])
  ],
  providers: [MakerProductService],
  controllers: [MakerProductController],
})
export class MakerProductModule {}
