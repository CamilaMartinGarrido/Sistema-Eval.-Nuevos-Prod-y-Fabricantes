import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';
import { UserRoleEnum } from '../enums';

@Unique('uq_user_account_username', ['username'])
@Index('idx_user_account_role', ['role'])
@Index('idx_user_account_active', ['is_active'], { where: `"is_active" = true` })
@Entity({ name: 'user_account' })
export class UserAccountEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    enumName: 'user_role_enum',
    default: UserRoleEnum.OBSERVADOR,
    nullable: false,
  })
  role: UserRoleEnum;

  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  is_active: boolean;
}
