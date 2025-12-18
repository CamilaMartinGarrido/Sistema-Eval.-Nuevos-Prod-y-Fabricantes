import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';

@Entity({ name: 'client' })
export class ClientEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  client_name: string;

  @Column({ type: 'varchar', nullable: false })
  client_country: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at_Client: Date;

  @OneToMany(() => ApplicationEntity, (application) => application.client)
  applications: ApplicationEntity[];

  @OneToMany(() => ClientSupplyEntity, (client_supply) => client_supply.client)
  client_supplies: ClientSupplyEntity[];
}
