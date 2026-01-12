import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationProductEntity } from './application_product.entity';
import { ApplicationProductService } from './application_product.service';
import { ApplicationProductController } from './application_product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationProductEntity]),
  ],
  providers: [ApplicationProductService],
  controllers: [ApplicationProductController],
})
export class ApplicationProductModule {}
