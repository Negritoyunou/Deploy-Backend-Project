import { Body, Controller, Get, Param, Post, HttpException, HttpStatus, ParseUUIDPipe, Put, Delete } from "@nestjs/common";
import { IsUUID } from "class-validator";
import { OrderDetailsService } from "./orderDetails.service";
import { CreateOrderDetailsDto } from "./dto/create-orderDetails.dto";
import { ApiTags } from "@nestjs/swagger";
import { UpdateOrderDetailsDto } from "./dto/update-orderDetails.dto";

@ApiTags('order-details')
@Controller('order-details')
export class OrderDetailsController{
    constructor(private readonly orderDetailsService: OrderDetailsService){}

    @Get()
        findAll(){
            return this.orderDetailsService.findAll()
        }

    @Get(':id')
        findById(@Param('id', new ParseUUIDPipe()) id: string){
        if(!IsUUID(4, { each : true})){
            throw new HttpException("Incorrect ID", HttpStatus.BAD_REQUEST)
        }
        return this.orderDetailsService.findOne(id)
    }

    @Post()
        create(@Body() createOrderDetailsDto: CreateOrderDetailsDto){
        return this.orderDetailsService.create(createOrderDetailsDto)
    }

    @Put(':id')
    updateOrderDetailById(@Param('id') id: string, @Body() updateOrderDetailsDto: UpdateOrderDetailsDto) {
        return this.orderDetailsService.updateOrderDetailById(id, updateOrderDetailsDto);
    }

    @Delete(':id')
    async deleteOrderDetailById(@Param('id') id: string){
        return await this.orderDetailsService.deleteOrderDetailById(id)
    }

}