import { ApiProperty } from "@nestjs/swagger";
export class UpdateUserdto{

    email?: string;
    name?: string;
    address?: string;
    phone?: string;
    country?: string;
    password?: string;
    city?: string;
}