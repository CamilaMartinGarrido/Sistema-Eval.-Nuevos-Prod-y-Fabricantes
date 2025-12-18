import { SupplyEntity } from '../supply/supply.entity';
import { ClientEntity } from '../client/client.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'client_supply' })
export class ClientSupplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  client_id: number;

  @Column({ type: 'int' })
  supply_id: number;

  @ManyToOne(() => ClientEntity, (client) => client.client_supplies, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;
      
  @ManyToOne(() => SupplyEntity, (supply) => supply.client_supplies, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @CreateDateColumn({ type: 'timestamp' })
  created_at_ClientSupply: Date;
}
