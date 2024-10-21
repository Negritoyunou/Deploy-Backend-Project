import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateProductsdto {

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsString()
    imgUrl?: string;

}