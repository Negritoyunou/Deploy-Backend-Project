import { IsString, IsArray, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface ProductId{
    id: string;
}

export class CreateOrderDto{

    @ApiProperty({
        type: String,
        description: 'User id of order',
    })
    @IsString()
    @IsUUID()
    userId: string;

    @ApiProperty({
        type: Array,
        description: 'Products array of order',
        example: [
            { id: "2d3a89a4-b9e2-4f68-8e3d-0cb292b67d34" },
        ]
    })
    @IsArray()
    @IsNotEmpty()
    products: Array<ProductId>
}