import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderDetails } from "./orderdetails.entity";
import { OrderDetailsService } from "./orderDetails.service";
import { OrderDetailsController } from "./orderDetails.controller";

@Module({
    imports: [ TypeOrmModule.forFeature([OrderDetails])],
    controllers: [OrderDetailsController],
    providers: [OrderDetailsService],
    exports: [OrderDetailsService],
})
export class OrderDetailsModule {}