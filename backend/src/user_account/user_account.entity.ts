import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '../enums';

@Entity({ name: 'user_account' })
export class UserAccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    enumName: 'user_role_enum',
    nullable: false,
  })
  role: UserRoleEnum;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
