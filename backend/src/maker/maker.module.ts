import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MakerEntity } from './maker.entity';
import { MakerService } from './maker.service';
import { MakerController } from './maker.controller';
import { CommercialEntityModule } from 'src/commercial_entity/commercial_entity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MakerEntity]),
    CommercialEntityModule,
  ],
  providers: [MakerService],
  controllers: [MakerController],
})
export class MakerModule {}
