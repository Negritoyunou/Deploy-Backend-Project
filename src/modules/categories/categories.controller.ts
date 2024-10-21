import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoriesdto } from "./dto/create-categories.dto";
import { ApiTags } from "@nestjs/swagger";
import { UpdateCategoryDto } from "./dto/update-categories.dto";

@ApiTags('categories')
@Controller('categories')
export class CategoriesController{
    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Get()
    findAll(){
        return this.categoriesService.findAll()
    }

    @Post()
    async create(@Body() createCategoriesdto: CreateCategoriesdto){
        return await this.categoriesService.create(createCategoriesdto)
    }

    // @Put(':id')
    // updateCategoryById(@Param('id') id: string, @Body() updateCategoryById: UpdateCategoryDto) {
    //     return this.categoriesService.updateCategoryById(id, updateCategoryById);
    // }

    @Delete(':id')
    async deleteCategoryById(@Param('id') id: string){
        return await this.categoriesService.deleteCategoryById(id)
    }
}