import { Module } from '@nestjs/common';
import { UserAccountService } from './user_account.service';
import { UserAccountController } from './user_account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountEntity } from './user_account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccountEntity])],
  providers: [UserAccountService],
  controllers: [UserAccountController],
})
export class UserAccountModule {}
