import { CommercialEntityEntity } from 'src/commercial_entity/commercial_entity.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn, OneToMany,
 } from 'typeorm';

@Entity({ name: 'supplier' })
export class SupplierEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CommercialEntityEntity, ce => ce.suppliers, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: true, 
  })
  @JoinColumn({ name: 'commercial_entity_id' })
  commercial_entity: CommercialEntityEntity;

  @OneToMany(() => SupplyEntity, (supply) => supply.supplier)
    supplies: SupplyEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at_Supplier: Date;
}
