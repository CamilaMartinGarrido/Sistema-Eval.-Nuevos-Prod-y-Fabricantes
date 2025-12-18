import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { ApplicationEntity } from './application.entity';
import { ClientEntity } from '../client/client.entity';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity, ClientEntity, ProductEntity]),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
