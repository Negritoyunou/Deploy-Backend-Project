import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../users/users.service";
import { User } from "../users/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { SignUpAuthDto } from "../users/dto/signup-user.dto";
import { Role } from "../users/enums/role.enum";

describe('AuthService', () =>{
    let services: AuthService;

    beforeEach(async () => {
        const mockUserService: Partial<UserService> = {
            findByEmail: () => Promise.resolve(undefined),
            createUser: (entityLike?: Partial<User>) =>
                Promise.resolve({
                    ...entityLike,
                    administrador: "user",
                    id: "1234fs-1234fs-1234fs-1234fs",
                }as User),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, { provide: getRepositoryToken(User), useValue: {} },
                { provide: JwtService, useValue: {} },
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        services = module.get<AuthService>(AuthService);
    });


    const mockUser = new SignUpAuthDto({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
        passwordConfirm: '123456',
        phone: '123456789',
        address: 'Fake St. 123',
    });

    it('should be defined', () => {
        expect(services).toBeDefined()
    })

    it('signUp() create a new User with encrypted password', async () => {
        const user = await services.signUp(mockUser);
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('administrador', Role.User);
        expect(user).toHaveProperty('password')
    })
})
