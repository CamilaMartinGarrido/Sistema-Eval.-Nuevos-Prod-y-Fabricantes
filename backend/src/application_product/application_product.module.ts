import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationProductEntity } from './application_product.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ProductEntity } from '../product/product.entity';
import { ApplicationProductService } from './application_product.service';
import { ApplicationProductController } from './application_product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationProductEntity, ApplicationEntity, ProductEntity]),
  ],
  providers: [ApplicationProductService],
  controllers: [ApplicationProductController],
})
export class ApplicationProductModule {}
