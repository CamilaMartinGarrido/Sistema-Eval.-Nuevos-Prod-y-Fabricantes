import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { ProductTypeEnum } from '../enums';
import { ApplicationEntity } from '../application/application.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';

@Unique(['description', 'product_type'])
@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProductTypeEnum,
    enumName: 'product_type_enum',
    nullable: false,
  })
  product_type: ProductTypeEnum;

  @Column({ type: 'boolean' })
  exclusive_use: boolean;

  @Column({ type: 'int' })
  priority: number;

  @OneToMany(() => ApplicationEntity, (application) => application.product)
    applications: ApplicationEntity[];
  
  @OneToMany(() => MakerProductEntity, (maker_product) => maker_product.product)
  maker_products: MakerProductEntity[];
}
