import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Order } from '../orders/orders.entity';
import { Products } from '../products/products.entity';

@Entity({ name: 'order_details'})
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @OneToOne(() => Order, (order) => order.orderDetail)
  @JoinColumn()
  order: Order;

  @ManyToMany(() => Products, (product) => product.orderDetails)
  products: Products[];
}
