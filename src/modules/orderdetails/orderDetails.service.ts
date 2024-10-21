import { OrderDetails } from "./orderdetails.entity";
import { UpdateOrderDetailsDto } from "./dto/update-orderDetails.dto";
import { CreateOrderDetailsDto } from "./dto/create-orderDetails.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class OrderDetailsService{
    constructor(
        @InjectRepository(OrderDetails)
        private readonly orderDetailsRepository: Repository<OrderDetails>
    ){}

    async findAll(){
        return await this.orderDetailsRepository.find()
    }

    async  findOne(id: string) {
        return await this.orderDetailsRepository.findOneBy({ id });
    }

    async create(createOrderDetailsDto: CreateOrderDetailsDto): Promise<OrderDetails> {
        const orderDetail = this.orderDetailsRepository.create(createOrderDetailsDto)

        const orderDetailSaved = await this.orderDetailsRepository.save(orderDetail)

        return orderDetailSaved;
    }

    async updateOrderDetailById(id: string, updateOrderDetailsDto: UpdateOrderDetailsDto){
        const categoryFinded = await this.orderDetailsRepository.findOneBy({ id })
        if(!categoryFinded){
          throw new Error('Product not found')
        }
        await this.orderDetailsRepository.update(id, updateOrderDetailsDto)
        return await this.orderDetailsRepository.findOneBy({ id })
      }

      async deleteOrderDetailById(id: string): Promise<{id: string}>{
        await this.orderDetailsRepository.delete(id)
        return { id };
    }

    async findOneByOrderId( orderId: string, relations: string[] = [],): Promise<OrderDetails[]>{
        return await this.orderDetailsRepository.find({
            where: { order: { id: orderId } },
            relations: relations,
        })
    }
}