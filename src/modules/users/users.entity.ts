import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../orders/orders.entity'; 
import { v4 as uuid } from 'uuid';
import { Role } from './enums/role.enum';

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  country?: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  city?: string;

  @OneToMany(() => Order, (order) => order.user) 
  orders: Order[];

  @Column()
  administrador: string = Role.User;
}
