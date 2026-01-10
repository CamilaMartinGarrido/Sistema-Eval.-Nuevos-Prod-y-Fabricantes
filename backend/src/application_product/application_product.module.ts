import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application_product.service';
import { ApplicationController } from './application_product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationProductEntity]),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
