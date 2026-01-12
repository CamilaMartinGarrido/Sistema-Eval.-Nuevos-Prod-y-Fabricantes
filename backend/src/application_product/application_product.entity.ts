import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, OneToMany, Unique, Index } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { ProductEntity } from '../product/product.entity';

@Unique(['application_number'])
@Unique(['application_id', 'product_id'])
@Index('idx_app_product_app', ['application_id'])
@Index('idx_app_product_product', ['product_id'])
@Entity({ name: 'application_product' })
export class ApplicationProductEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ApplicationEntity, (app) => app.app_products, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;

  @ManyToOne(() => ProductEntity, (product) => product.app_products, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
