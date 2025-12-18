import { Module } from '@nestjs/common';
import { ClientSupplyService } from './client_supply.service';
import { ClientSupplyController } from './client_supply.controller';
import { ClientSupplyEntity } from './client_supply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '../client/client.entity';
import { SupplyEntity } from '../supply/supply.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientSupplyEntity, ClientEntity, SupplyEntity])
  ],
  providers: [ClientSupplyService],
  controllers: [ClientSupplyController],
})
export class ClientSupplyModule {}
