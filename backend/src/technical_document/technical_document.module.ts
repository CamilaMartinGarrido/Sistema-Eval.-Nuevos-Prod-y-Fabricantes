import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalDocumentService } from './technical_document.service';
import { TechnicalDocumentController } from './technical_document.controller';
import { TechnicalDocumentEntity } from './technical_document.entity';
import { SupplyEntity } from '../supply/supply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechnicalDocumentEntity, SupplyEntity])],
  providers: [TechnicalDocumentService],
  controllers: [TechnicalDocumentController],
})
export class TechnicalDocumentModule {}
