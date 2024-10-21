import { ApiProperty } from "@nestjs/swagger";
export class UserResponseDto{

    id: string;
    name: string;
    email: string;
    phone: string;
    country?: string;
    address: string; 
    city?: string;

    constructor(partial: Partial<UserResponseDto>){
        const { id, name, email, address, phone, country, city } = partial;
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.country = country;
        this.city = city;
    }

}