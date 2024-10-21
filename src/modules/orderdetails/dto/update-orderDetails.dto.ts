import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderDetailsDto } from "./create-orderDetails.dto";

export class UpdateOrderDetailsDto extends PartialType(CreateOrderDetailsDto) {}