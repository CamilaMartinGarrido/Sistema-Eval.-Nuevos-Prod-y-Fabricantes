import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { SupplyEntity } from '../supply/supply.entity';
import { ClientEntity } from '../client/client.entity';
import { ApplicationEntity } from '../application/application.entity';

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
    onDelete: 'RESTRICT', 
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;
      
  @ManyToOne(() => SupplyEntity, (supply) => supply.client_supplies, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @OneToOne(() => ApplicationEntity, (app) => app.client_supply, {
    eager: true,        
    nullable: false,     
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;
}
