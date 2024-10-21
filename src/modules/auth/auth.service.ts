import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { SignInAuthDto } from '../users/dto/signin-user.dto';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpAuthDto } from '../users/dto/signup-user.dto';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(credentials: SignInAuthDto){
        const user = await this.userService.findByEmail(credentials.email);

        if(!user){
            throw new HttpException('User Not Found', 404)
        }

        const isPasswordMatching = await bcrypt.compare(
            credentials.password, 
            user.password
        )

        if(!isPasswordMatching){
            throw new HttpException('Wrong credentials provided', HttpStatus.UNAUTHORIZED)
        }

        const token = await this.createToken(user)
        return { token };

    }

    async signUp(signUpUser: SignUpAuthDto){
        const userFinded = await this.userService.findByEmail(
            signUpUser.email,
        );

        if(userFinded){
            throw new BadRequestException('User already exists')
        }

        if(signUpUser.password !== signUpUser.passwordConfirm){
            throw new HttpException('Password does not match', 400)
        }

        signUpUser.password = await bcrypt.hash(signUpUser.password, 10)

        if(!signUpUser.password){
            throw new BadRequestException('Error at password hash')
        }

        const newUser = await this.userService.createUser(signUpUser)
        return newUser;
    }

    private async createToken(user: User){
        const payload = {
            id: user.id,
            email: user.email,
            roles: user.administrador,
        };

        return this.jwtService.signAsync(payload);
    }
}