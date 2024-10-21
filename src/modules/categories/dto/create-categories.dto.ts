import { IsNumber, IsString } from "class-validator";

export class CreateCategoriesdto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;
    
    category: string;
}