import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, Unique, OneToMany } from 'typeorm';
import { SupplyEntity } from '../supply/supply.entity';
import { ClientEntity } from '../client/client.entity';
import { ApplicationEntity } from '../application/application.entity';
import { DocumentEvaluationEntity } from '../document_evaluation/document_evaluation.entity';

@Unique(['client', 'supply', 'application'])
@Entity({ name: 'client_supply' })
export class ClientSupplyEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ClientEntity, (client) => client.client_supplies, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT', 
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;
      
  @ManyToOne(() => SupplyEntity, (supply) => supply.client_supplies, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @OneToOne(() => ApplicationEntity, (app) => app.client_supply, {
    eager: true,        
    nullable: false,     
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;

  @OneToMany(() => DocumentEvaluationEntity, document => document.client_supply)
  document_evals: DocumentEvaluationEntity[];
}
