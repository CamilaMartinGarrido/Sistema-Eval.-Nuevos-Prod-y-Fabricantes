import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UserAccountService } from './user_account.service';
import { CreateUserAccountDto } from './dtos/create-user_account-dto';
import { UserAccountEntity } from './user_account.entity';
import { UserAccountResponseDto } from './dtos/user_account-response-dto';
import { UpdateUserAccountDto } from './dtos/update-user_account-dto';

@Controller('user_account')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Post()
  async createUserAccount(
    @Body() dto: CreateUserAccountDto
  ): Promise<{ message: string; data: UserAccountEntity; }> {
    return this.userAccountService.create(dto);
  }

  @Get()
  async getUserAccounts(
    @Query('limit', ParseIntPipe) limit = 100,
    @Query('offset', ParseIntPipe) offset = 0,
  ): Promise<UserAccountResponseDto[]> {
    return this.userAccountService.findAll(limit, offset);
  }

  @Get(':id')
  async getUserAccount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserAccountResponseDto> {
    return this.userAccountService.findOne(id);
  }

  @Patch(':id')
  async updateUserAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserAccountDto,
  ): Promise<{ message: string; }> {
    return this.userAccountService.update(id, dto);
  }

  @Delete(':id')
  async deleteUserAccount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.userAccountService.remove(id);
  }
}
