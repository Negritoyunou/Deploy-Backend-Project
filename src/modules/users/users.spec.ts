import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

describe('UserService - createUser', () => {
  let service: UserService;
  let repository: Repository<User>;

  // Antes de cada test, configuramos el módulo de pruebas para inyectar el servicio y el repositorio simulado.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          // Proporcionamos un token de repositorio para inyectar el repositorio de User.
          provide: getRepositoryToken(User),
          useClass: Repository, // Usamos la clase Repository simulada.
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService); // Obtenemos una instancia del servicio de usuarios.
    repository = module.get<Repository<User>>(getRepositoryToken(User)); // Obtenemos una instancia del repositorio de usuarios.
  });

  // Test para verificar si se crea y guarda un nuevo usuario correctamente.
  it('should create and save a new user successfully', async () => {
    const userDto = { 
      name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
      passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
    };
    const newUser = { id: 1, ...userDto }; // Mock del nuevo usuario con un ID.

    // Simulamos los métodos create y save del repositorio.
    jest.spyOn(repository, 'create').mockReturnValue(newUser as any);
    jest.spyOn(repository, 'save').mockResolvedValue(newUser as any);

    const result = await service.createUser(userDto); // Llamamos al método createUser.
    expect(result).toEqual(newUser); // Verificamos que el resultado sea el nuevo usuario.
  });

  // Test para verificar si se lanza un error al fallar el guardado en la base de datos.
  it('should throw an error if save fails', async () => {
    const userDto = { 
      name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
      passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
    };

    jest.spyOn(repository, 'create').mockReturnValue(userDto as any); // Simulamos el método create.
    jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database save failed')); // Simulamos una falla en el guardado.

    // Verificamos que el método arroje un error si el guardado falla.
    await expect(service.createUser(userDto)).rejects.toThrow('Database save failed');
  });

  // Test para verificar que el método create del repositorio sea llamado con los datos correctos.
  it('should call the create method with correct data', async () => {
    const userDto = { 
      name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
      passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
    };

    const createSpy = jest.spyOn(repository, 'create').mockReturnValue(userDto as any); // Espiamos el método create.
    jest.spyOn(repository, 'save').mockResolvedValue(userDto as any); // Simulamos el método save.

    await service.createUser(userDto); // Llamamos a createUser.
    expect(createSpy).toHaveBeenCalledWith(userDto); // Verificamos que create haya sido llamado con los datos correctos.
  });

  // Test para verificar que el método save del repositorio sea llamado con el usuario creado.
  it('should call the save method with the created user', async () => {
    const userDto = { 
      name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
      passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
    };
    const newUser = { id: 1, ...userDto }; // Mock del nuevo usuario.

    jest.spyOn(repository, 'create').mockReturnValue(newUser as any); // Simulamos el método create.
    const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(newUser as any); // Espiamos el método save.

    await service.createUser(userDto); // Llamamos a createUser.
    expect(saveSpy).toHaveBeenCalledWith(newUser); // Verificamos que save haya sido llamado con el nuevo usuario.
  });

  // Test para verificar que el método createUser devuelva correctamente el usuario creado.
  it('should return the created user correctly', async () => {
    const userDto = { 
      name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
      passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
    };
    const newUser = { id: 1, ...userDto }; // Mock del nuevo usuario.

    jest.spyOn(repository, 'create').mockReturnValue(newUser as any); // Simulamos el método create.
    jest.spyOn(repository, 'save').mockResolvedValue(newUser as any); // Simulamos el método save.

    const result = await service.createUser(userDto); // Llamamos a createUser.
    expect(result).toEqual(newUser); // Verificamos que el resultado sea el nuevo usuario.
  });
});

// Pruebas para el método updateUserById.
describe('UserService - updateUserById', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Usamos la clase Repository simulada.
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService); // Obtenemos una instancia del servicio de usuarios.
    repository = module.get<Repository<User>>(getRepositoryToken(User)); // Obtenemos una instancia del repositorio de usuarios.
  });

  // Test para verificar que se actualice un usuario existente correctamente.
  it('should update an existing user successfully', async () => {
    const userId = '1';
    const userDto = { 
      name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
      passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
    };
    const existingUser = { id: userId, ...userDto }; // Mock del usuario existente.

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingUser as any); // Simulamos el método findOneBy.
    jest.spyOn(repository, 'update').mockResolvedValue(undefined); // Simulamos el método update.

    const result = await service.updateUserById(userId, userDto); // Llamamos a updateUserById.
    expect(result).toEqual(existingUser); // Verificamos que el resultado sea el usuario actualizado.
  });

  // Test para verificar que se arroje un error si no se encuentra el usuario.
  it('should throw an error if user is not found', async () => {
    const userId = '1';
    const userDto = { 
      name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
      passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
    };

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null); // Simulamos que el usuario no se encuentra.

    await expect(service.updateUserById(userId, userDto)).rejects.toThrow('User not found'); // Verificamos que se arroje el error.
  });

  // Test para verificar que findOneBy sea llamado con el ID correcto.
  it('should call findOneBy with the correct id', async () => {
    const userId = '1';
    const userDto = { 
      name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
      passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
    };
    const existingUser = { id: userId, ...userDto }; // Mock del usuario existente.

    const findOneBySpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingUser as any); // Espiamos el método findOneBy.
    jest.spyOn(repository, 'update').mockResolvedValue(undefined); // Simulamos el método update.

    await service.updateUserById(userId, userDto); // Llamamos a updateUserById.
    expect(findOneBySpy).toHaveBeenCalledWith({ id: userId }); // Verificamos que findOneBy haya sido llamado con el ID correcto.
  });

    // Test para verificar que el método update del repositorio sea llamado con los datos correctos.
    it('should call update with the correct data', async () => {
        const userId = '1';
        const userDto = { 
          name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
          passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
        };
        const existingUser = { id: userId, ...userDto }; // Mock del usuario existente.
  
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingUser as any); // Simulamos el método findOneBy.
        const updateSpy = jest.spyOn(repository, 'update').mockResolvedValue(undefined); // Espiamos el método update.
  
        await service.updateUserById(userId, userDto); // Llamamos a updateUserById.
        expect(updateSpy).toHaveBeenCalledWith(userId, userDto); // Verificamos que update haya sido llamado con el ID y datos correctos.
      });
  
      // Test para verificar que el método updateUserById devuelva correctamente el usuario actualizado.
      it('should return the updated user correctly', async () => {
        const userId = '1';
        const userDto = { 
          name: 'John Doe', email: 'john@example.com', password: 'Hash123@', 
          passwordConfirm: 'Hash123@', phone: '123456789', address: 'St. Fake 123', administrador: 'user' 
        };
        const updatedUser = { id: userId, ...userDto }; // Mock del usuario actualizado.
  
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(updatedUser as any); // Simulamos el método findOneBy.
        jest.spyOn(repository, 'update').mockResolvedValue(undefined); // Simulamos el método update.
  
        const result = await service.updateUserById(userId, userDto); // Llamamos a updateUserById.
        expect(result).toEqual(updatedUser); // Verificamos que el resultado sea el usuario actualizado.
      });
    })  
  
