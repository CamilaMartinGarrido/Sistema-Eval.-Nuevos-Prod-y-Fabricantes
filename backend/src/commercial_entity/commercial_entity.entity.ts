import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { MakerEntity } from '../maker/maker.entity';
import { SupplierEntity } from '../supplier/supplier.entity';

@Entity({ name: 'commercial_entity' })
export class CommercialEntityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  entity_name: string;

  @Column({ type: 'varchar' })
  entity_country: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at_CommercialEntity: Date;

  @OneToMany(() => MakerEntity, maker => maker.commercial_entity)
  makers: Promise<MakerEntity[]>;

  @OneToMany(() => SupplierEntity, supplier => supplier.commercial_entity)
  suppliers: Promise<SupplierEntity[]>;
}
