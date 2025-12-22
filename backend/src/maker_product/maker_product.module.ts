import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MakerProductService } from './maker_product.service';
import { MakerProductController } from './maker_product.controller';
import { MakerProductEntity } from './maker_product.entity';
import { ProductEntity } from '../product/product.entity';
import { CommercialEntityEntity } from 'src/commercial_entity/commercial_entity.entity';
import { CommercialEntityModule } from 'src/commercial_entity/commercial_entity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [MakerProductEntity, ProductEntity, CommercialEntityEntity]),
      CommercialEntityModule,
  ],
  providers: [MakerProductService],
  controllers: [MakerProductController],
})
export class MakerProductModule {}
