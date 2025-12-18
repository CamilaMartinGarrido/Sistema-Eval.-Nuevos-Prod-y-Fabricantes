import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { UserAccountService } from './user_account.service';
import { CreateUserAccountDto } from './dto';

@Controller('user_account')
export class UserAccountController {
  constructor(private readonly svc: UserAccountService) {}

  @Post()
  create(@Body() dto: CreateUserAccountDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.svc.findAll(limit ? +limit : 100, offset ? +offset : 0);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateUserAccountDto>) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
