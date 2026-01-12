import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationProcessEntity } from './evaluation_process.entity';
import { ApplicationEntity } from '../application/application.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { EvaluationProcessService } from './evaluation_process.service';
import { EvaluationProcessController } from './evaluation_process.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationProcessEntity, ApplicationEntity, SupplyEntity])
  ],
  providers: [EvaluationProcessService],
  controllers: [EvaluationProcessController],
})
export class EvaluationProcessModule {}
