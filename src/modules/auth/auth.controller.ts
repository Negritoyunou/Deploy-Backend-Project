import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from '../users/dto/signin-user.dto';
import { SignUpAuthDto } from '../users/dto/signup-user.dto';
import { UserResponseDto } from '../users/dto/response-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    signIn(@Body() credentials: SignInAuthDto){
        return this.authService.signIn(credentials)
    }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() signUpUser: SignUpAuthDto){
       const user = await this.authService.signUp(signUpUser);
       return new UserResponseDto(user);
    }
}