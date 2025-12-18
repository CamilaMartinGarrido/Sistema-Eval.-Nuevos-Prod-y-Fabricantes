import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccountEntity } from './user_account.entity';
import { CreateUserAccountDto } from './dto';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccountEntity)
    private readonly userAccountRepository: Repository<UserAccountEntity>,
  ) {}

  create(dto: CreateUserAccountDto) {
    const e = this.userAccountRepository.create(dto);
    return this.userAccountRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.userAccountRepository.find({ take: limit, skip: offset });
  }

  findOne(id: number) {
    return this.userAccountRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateUserAccountDto>) {
    await this.userAccountRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.userAccountRepository.delete(id);
  }
}
