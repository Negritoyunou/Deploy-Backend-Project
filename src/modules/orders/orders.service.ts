import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./orders.entity";
import { Repository } from "typeorm";
import { UserService } from "../users/users.service";
import { ProductsService } from "../products/products.service";
import { CreateOrderDto, ProductId } from "./dto/create-order.dto";
import { CreateOrderDetailsDto } from "../orderdetails/dto/create-orderDetails.dto";
import { OrderDetailsService } from "../orderdetails/orderDetails.service";
import { OrderResponseDto } from "./dto/response-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";


@Injectable()
export class OrdersService{
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly userService: UserService,
        private readonly productService: ProductsService,
        private readonly orderDetailsService: OrderDetailsService,
    ) {}


async create( createOrderDto: CreateOrderDto ){
    const { userId, products } = createOrderDto;
    const user = await this.userService.getUserById(userId)

    const order = {
        user: user,
        date: new Date(),
    };

    console.log("Productos dentro de order service ", products);
    

    const orderEntity = await this.orderRepository.save(
        this.orderRepository.create(order)
    );

    console.log('Orden creada:', orderEntity);

    const total = await this.calculateTotal(products);
    console.log('Total de la orden:', total);

    const orderDetail = new CreateOrderDetailsDto();
    orderDetail.price = total;
    orderDetail.products = products;
    orderDetail.order = orderEntity;

    const orderDetailEntity = await this.orderDetailsService.create(orderDetail);

    orderEntity.orderDetail = orderDetailEntity;

    await this.orderRepository.save(orderEntity);

    console.log('Orden guardada con detalles:', orderDetailEntity);
    return new OrderResponseDto(orderDetailEntity);
}

    private async calculateTotal(products: Array<ProductId>): Promise<number> {
        let total: number = 0;
        console.log("Array de products dentro de Order", products)
        for(const product of products){

        // Verifica el ID de cada producto antes de pasar a buyProducts
        console.log('Procesando producto con ID:', product.id);
            const price = await this.productService.buyProducts(product.id);
            total += Number(price)

        // Verifica el precio después de comprar el producto
        console.log('Precio del producto:', price);
        }

        console.log('Total calculado:', total);
        return total;
    }

    async findAll(){
        return await this.orderRepository.find()
    }

    async findOne(id: string){
        const order = await this.orderRepository.findOneBy({ id });
        const orderDetail = await this.orderDetailsService.findOneByOrderId(
            order.id,
            ['products', 'order'],
        );
        return orderDetail;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto){
        const order = await this.orderRepository.findOneBy({ id })

        if(!order){
            return null;
        }
    }

    async deleteOrderById(id: string): Promise<{id: string}>{
        await this.orderRepository.delete(id)
        return { id };
    }
}