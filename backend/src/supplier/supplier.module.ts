import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './supplier.entity';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { CommercialEntityModule } from 'src/commercial_entity/commercial_entity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierEntity]),
    CommercialEntityModule,
  ],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}
