import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateOrderDetailsDto {

    @ApiProperty({
        type: Number,
        description: "Price of the Order Detail",
        example: 59.99,
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        type: Object,
        description: 'Order associated with the order detail',
        example: [
            { id: "eebf07e1-0987-4c8e-b6b2-d327888f2e67"},
        ]
    })
    order: object;
    
    @ApiProperty({
        type: [Object],
        description: 'Order associated with the order detail',
        example: [
            { id: "2d3a89a4-b9e2-4f68-8e3d-0cb292b67d34" },
        ]
    })
    products: Array<Object>;
}