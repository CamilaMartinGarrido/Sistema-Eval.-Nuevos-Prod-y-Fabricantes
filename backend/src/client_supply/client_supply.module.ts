import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientSupplyService } from './client_supply.service';
import { ClientSupplyController } from './client_supply.controller';
import { ClientSupplyEntity } from './client_supply.entity';
import { ClientEntity } from '../client/client.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { ApplicationEntity } from '../application/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientSupplyEntity, ClientEntity, SupplyEntity, ApplicationEntity])
  ],
  providers: [ClientSupplyService],
  controllers: [ClientSupplyController],
})
export class ClientSupplyModule {}
