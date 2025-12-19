import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { CommercialEntityRoleEntity } from './commercial_entity_role.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { SupplyEntity } from '../supply/supply.entity';

@Unique(['entity_name', 'entity_country'])
@Entity({ name: 'commercial_entity' })
export class CommercialEntityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  entity_name: string;

  @Column({ type: 'varchar' })
  entity_country: string;

  @OneToMany(() => CommercialEntityRoleEntity, role => role.commercial_entity)
  roles: CommercialEntityRoleEntity[];

  @OneToMany(() => MakerProductEntity, makerProduct => makerProduct.maker_entity)
  maker_products: MakerProductEntity[];

  @OneToMany(() => SupplyEntity, supply => supply.supplier_entity,)
  supplies: SupplyEntity[];
}
