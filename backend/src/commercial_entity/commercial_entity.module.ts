import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommercialEntityEntity } from './commercial_entity.entity';
import { CommercialEntityService } from './commercial_entity.service';
import { CommercialEntityController } from './commercial_entity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommercialEntityEntity])],
  providers: [CommercialEntityService],
  controllers: [CommercialEntityController],
  exports: [CommercialEntityService],
})
export class CommercialEntityModule {}
