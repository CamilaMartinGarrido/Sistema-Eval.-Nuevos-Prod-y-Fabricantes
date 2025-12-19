import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { CommercialEntityEntity } from './commercial_entity.entity';
import { RoleEnum } from 'src/enums';

@Unique(['commercial_entity', 'role_type'])
@Entity({ name: 'commercial_entity_role' })
export class CommercialEntityRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CommercialEntityEntity, entity => entity.roles, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT', 
  })
  @JoinColumn({ name: 'commercial_entity' })
  commercial_entity: CommercialEntityEntity;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    enumName: 'role_enum',
    nullable: false,
  })
  role_type: RoleEnum;
}
