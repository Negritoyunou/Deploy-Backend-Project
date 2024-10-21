import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInAuthDto {

    @ApiProperty({
        type: String,
        description: 'Email of user',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: String,
        description: 'Password of user',
        required: true,
    })
    @IsNotEmpty()
    password: string;

    constructor(partial: Partial<SignInAuthDto>){
        Object.assign(this, partial)
    }
}