import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, UsePipes, ValidationPipe, ParseUUIDPipe, HttpException, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductsdto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { IsUUID } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ImageUploadPipe } from '../pipes/image-upload/image-upload.pipe';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Role } from '../users/enums/role.enum';
import { Roles } from 'src/decorators/role-decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateProductsDto } from './dto/update-product.dto';

@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor (
        private readonly productsService: ProductsService,
        private readonly fileUploadService: FileUploadService
    ) {}

    @Get()
    async getProducts (
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '5'
    ) {
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 5;
        const products = await this.productsService.getProducts(pageNumber, limitNumber);
        return { data: products };
    }

    @Get(':id')
    async getProductsById(@Param('id', new ParseUUIDPipe()) id: string) {
    const product = await this.productsService.getProductsById(id);
        if(!IsUUID(4, { each : true})){
            throw new HttpException("Incorrect ID", HttpStatus.BAD_REQUEST)
   }

        if(!product){
            throw new HttpException("Product Not Found", HttpStatus.NOT_FOUND)
   }

   return product;
  }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    updateProductById(@Param('id') id: string, @Body() updatePrductById: UpdateProductsDto) {
        return this.productsService.updateProductById(id, updatePrductById);
    }


    @UseGuards(AuthGuard)
    @Post()
    @UsePipes(new ValidationPipe())
    async createProducts(@Body() product: CreateProductsdto){
        return await this.productsService.createProducts(product);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteProducts(@Param('id') id: string) {
        return await this.productsService.deleteProducts(id);
    }

    @Post('uploadImage/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.CREATED)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        }
    })
    async uploadFile(
        @Param('id') id: string, 
        @UploadedFile(new ImageUploadPipe()) file: Express.Multer.File ) {
        return this.productsService.uploadFile(file, id);
    }

    @Get('image/:id')
    @HttpCode(200)
    async getImage(@Param('id') id: string){
        return this.fileUploadService.getUrl(id);
    }
}