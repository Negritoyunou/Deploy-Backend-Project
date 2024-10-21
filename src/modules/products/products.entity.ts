import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { v4 as uuid } from 'uuid' 
import { Category } from '../categories/categories.entity';
import { OrderDetails } from '../orderdetails/orderdetails.entity'; 
@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.products) 
  category: Category;

  @ManyToMany(() => OrderDetails, (orderdetail) => orderdetail.products) 
  @JoinTable()
  orderDetails: OrderDetails[];
}
