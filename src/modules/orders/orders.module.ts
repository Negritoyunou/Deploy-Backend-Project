import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./orders.entity";
import { OrderDetails } from "../orderdetails/orderdetails.entity";
import { User } from "../users/users.entity";
import { Products } from "../products/products.entity";
import { UserModule } from "../users/users.module";
import { ProductsModule } from "../products/products.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { OrderDetailsModule } from "../orderdetails/orderDetails.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderDetails, User, Products]),
        UserModule,
        ProductsModule,
        OrderDetailsModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}