import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccountEntity } from './user_account.entity';
import { CreateUserAccountDto } from './dtos/create-user_account-dto';
import { UpdateUserAccountDto, UserAccountResponseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccountEntity)
    private readonly userAccountRepository: Repository<UserAccountEntity>,
  ) {}

  async create(dto: CreateUserAccountDto): Promise<{ message: string; data: UserAccountEntity }> {
    const user_acount = this.userAccountRepository.create(dto);
    const created = await this.userAccountRepository.save(user_acount);
    
    return { 
      message: 'User Acount created successfully',
      data: created
    };
  }

  async findAll(limit = 100, offset = 0) {
    const users = await this.userAccountRepository.find({ take: limit, skip: offset });

    return Promise.all(
      users.map(async (u) => this.toResponseDto(u)),
    );
  }

  async findOne(id: number) {
    const user_acount = await this.userAccountRepository.findOneBy({ id });
    if (!user_acount) {
      throw new NotFoundException('User Acount not found');
    }
    return this.toResponseDto(user_acount);
  }

  private async toResponseDto(entity: UserAccountEntity): Promise<UserAccountResponseDto> {
    return toDto(UserAccountResponseDto, entity);
  }

  async update(id: number, dto: UpdateUserAccountDto) {
    const result = await this.userAccountRepository.update(id, dto);
    if (result.affected === 0) {
      throw new NotFoundException('User Account could not be updated');
    }
    return { message: 'User Account updated successfully' };
  }

  async remove(id: number) {
    const user_account = await this.userAccountRepository.findOneBy({ id });
    if (!user_account) {
      throw new NotFoundException('User Account not found');
    }
    await this.userAccountRepository.remove(user_account);
    return { message: 'User Account deleted successfully' };
  }
}
