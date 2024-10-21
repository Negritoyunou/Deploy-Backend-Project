import { IsEmail, IsNotEmpty, Length, IsString, Matches, IsOptional } from "class-validator";
import { Role } from "../enums/role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpAuthDto{

    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    name: string; 

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Matches(
        /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[=!@#$%^&])[A-Za-z\d=!@#$%^&]{8,15}$/,
        {
            message : 
            "La contraseña debe contener una minuscula, una mayuscula, un numero, un simbolo"
        }
    )
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    passwordConfirm: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Length(5, 20)
    country?: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    address: string ;

    @IsString()
    @IsOptional()
    @Length(5, 20)
    city?: string;

    administrador: string = Role.User

    constructor(partial: Partial<SignUpAuthDto>){
        Object.assign(this, partial);
    }
}