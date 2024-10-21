import { Controller, Post, Get, Param, Body, ParseUUIDPipe, HttpException, HttpStatus, UseGuards, Put, Delete, ParseFloatPipe } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { IsUUID } from 'class-validator';
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UpdateOrderDto } from "./dto/update-order.dto";

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrdersController{
    constructor(
        private readonly ordersService: OrdersService
    ){}

    @Get()
        async findAll(){
        return await this.ordersService.findAll()
    }

    @UseGuards(AuthGuard)
    @Post()
        async createOrder(@Body() createOrderDto: CreateOrderDto){
        return await this.ordersService.create(createOrderDto);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findOrder(@Param('id', new ParseUUIDPipe()) id: string){
    if(!IsUUID(4, { each : true})){
        throw new HttpException("Incorrect ID", HttpStatus.BAD_REQUEST)
    }

        return await this.ordersService.findOne(id);
    }

    @Put(':id')
    async updateOrderById(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.ordersService.update(id, updateOrderDto);
    }

    @Delete(':id')
    async deleteOrderById(id: string): Promise<{id: string}>{
        await this.ordersService.deleteOrderById(id)
        return { id };
    }


}

