import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { v4 as uuid } from 'uuid'
import { User } from '../users/users.entity';
import { OrderDetails } from '../orderdetails/orderdetails.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  date: Date;

  @OneToOne(() => OrderDetails, (orderDetail) => orderDetail.order)
  @JoinColumn()
  orderDetail: OrderDetails;
}
