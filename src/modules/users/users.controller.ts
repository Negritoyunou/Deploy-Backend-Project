import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus, ParseUUIDPipe, HttpException } from '@nestjs/common';
import { UserService } from './users.service';
import { IsUUID } from 'class-validator';
import { CreateUserdto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserdto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { Roles } from 'src/decorators/role-decorator';


@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
    constructor (
        private readonly userService: UserService
    ) {}

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(200)
    @Roles(Role.Admin)
    async findAll(){
        return await this.userService.findAll()
    }

    @UseGuards(AuthGuard)
    @Get('page')
    async findWithPagination(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '5',
    ) {
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 5;
        const users = await this.userService.getUsers(pageNumber, limitNumber);
        return { data: users };
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    getUserById(@Param('id', new ParseUUIDPipe()) id: string){
        if(!IsUUID(4, { each : true})){
            throw new HttpException("Incorrect ID", HttpStatus.BAD_REQUEST)
   }

        return this.userService.getUserById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() user: CreateUserdto){
        return await this.userService.createUser(user);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    updateUserById(@Param('id') id: string, @Body() user: UpdateUserdto) {
        return this.userService.updateUserById(id, user);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

}
