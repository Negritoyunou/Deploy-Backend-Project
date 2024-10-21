import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "src/modules/auth/auth.controller";
import { hash } from 'bcrypt';
import { UserService } from "src/modules/users/users.service";
import { User } from "src/modules/users/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { SignInAuthDto } from "src/modules/users/dto/signin-user.dto";
import { SignUpAuthDto } from "src/modules/users/dto/signup-user.dto";
import { UserResponseDto } from "src/modules/users/dto/response-user.dto";
import { AuthService } from "src/modules/auth/auth.service";


describe('AuthController', () => {
    let controller: AuthController;
    let mockUserService: Partial<UserService>;

    beforeEach(async () => {
        const hashedPassword = await hash('123456', 10);
        mockUserService = {
            // Modifica el comportamiento para 'findByEmail' según la prueba
            findByEmail: jest.fn((email: string) => {
                if(email === 'johndoe@gmail.com'){
                    return Promise.resolve(undefined);  // Simula que el usuario NO existe durante el signUp
                } else {
                    return Promise.resolve(undefined);
                }
            }),
            createUser: (entityLike: Partial<User>): Promise<User> => 
                Promise.resolve({
                    ...entityLike,
                    administrador: "user",
                    id: "1234fs-1234fs-1234fs-1234fs",
                } as User),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [ AuthService,
                { provide: getRepositoryToken(User), useValue: {} },
                { provide: JwtService, useValue: { signAsync: () => Promise.resolve('mockJwtToken') } },
                { provide: UserService, useValue: mockUserService }
            ]
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    const mockSignUpUser = new SignUpAuthDto({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
        passwordConfirm: '123456',
        phone: '123456789',
        address: 'Fake St. 123',
    });

    const mockSignInUser = new SignInAuthDto({
        email: "johndoe@gmail.com",
        password: "123456",
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('signUp() should return a new UserResponseDto and create User', async () => {
        // Simula que el usuario no existe para la prueba de registro
        (mockUserService.findByEmail as jest.Mock).mockResolvedValueOnce(undefined);

        const user = await controller.signUp(mockSignUpUser);
        expect(user).toBeDefined();
        expect(user).toBeInstanceOf(UserResponseDto);
        expect(user).toHaveProperty('id');
    });

    it('signIn() should return a token', async () => {
        // Simula que el usuario existe durante la prueba de inicio de sesión
        (mockUserService.findByEmail as jest.Mock).mockResolvedValueOnce({
            email: "johndoe@gmail.com",
            password: await hash('123456', 10),
            administrador: "user",
        } as User);

        const token = await controller.signIn(mockSignInUser);
        expect(token).toBeDefined();
        expect(token).toHaveProperty('token');
    });
});