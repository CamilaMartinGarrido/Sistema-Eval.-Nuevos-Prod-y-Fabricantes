import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';

@Unique(['client_name', 'client_country'])
@Entity({ name: 'client' })
export class ClientEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  client_name: string;

  @Column({ type: 'varchar', nullable: false })
  client_country: string;

  @OneToMany(() => ApplicationEntity, (application) => application.client)
  applications: ApplicationEntity[];

  @OneToMany(() => ClientSupplyEntity, (client_supply) => client_supply.client)
  client_supplies: ClientSupplyEntity[];
}
