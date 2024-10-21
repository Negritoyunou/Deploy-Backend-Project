import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoriesdto } from "./create-categories.dto";

export class UpdateCategoryDto extends PartialType(CreateCategoriesdto) {}