import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  // @ManyToOne(() => Order)
  //
  @ManyToOne(type => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  @Exclude()
  order: Order;

  @Column()
  product_id: string;

  // @ManyToOne(() => Product)

  @ManyToOne(type => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  @Exclude()
  product: Product;

  @Column('decimal', { precision: 13, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrdersProducts;
