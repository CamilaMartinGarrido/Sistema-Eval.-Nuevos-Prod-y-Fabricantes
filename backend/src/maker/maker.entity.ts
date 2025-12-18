import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';

@Entity({ name: 'maker' })
export class MakerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CommercialEntityEntity, ce => ce.makers, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: true, 
  })
  @JoinColumn({ name: 'commercial_entity_id' })
  commercial_entity: CommercialEntityEntity;

  @OneToMany(() => MakerProductEntity, (maker_product) => maker_product.maker)
    maker_products: MakerProductEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at_Maker: Date;
}
