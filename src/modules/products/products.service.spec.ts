import { Repository } from "typeorm";
import { ProductsService } from "./products.service";
import { Products } from "./products.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FileUploadService } from "../file-upload/file-upload.service"; // Importamos FileUploadService

describe('ProductService - buyProducts', () => {
    let service: ProductsService;
    let repository: Repository<Products>;
    let fileUploadService: FileUploadService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Products),
                    useClass: Repository,
                },
                {
                    provide: FileUploadService,
                    useValue: {
                        // Aquí puedes agregar métodos mock si son necesarios
                        // Por ejemplo:
                        // uploadFile: jest.fn().mockResolvedValue('url-del-archivo'),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        repository = module.get<Repository<Products>>(getRepositoryToken(Products));
        fileUploadService = module.get<FileUploadService>(FileUploadService);
    });

    // 1. Prueba para verificar que el producto se encuentra correctamente
    it('debería encontrar el producto por ID', async () => {
        const productId = '1';
        const product = { id: productId, price: 100, stock: 10 };

        const findOneBySpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(product as any);
        jest.spyOn(repository, 'update').mockResolvedValue(undefined);

        await service.buyProducts(productId);

        expect(findOneBySpy).toHaveBeenCalledWith({ id: productId });
    });

    // 2. Prueba para verificar que lanza un error si no hay stock
    it('debería lanzar un error si el producto está agotado', async () => {
        const productId = '1';
        const product = { id: productId, stock: 0 };

        jest.spyOn(repository, 'findOneBy').mockResolvedValue(product as any);

        await expect(service.buyProducts(productId)).rejects.toThrow('Out of stock');
    });

    // 3. Prueba para verificar que disminuye el stock correctamente
    it('debería disminuir el stock en 1 si hay stock disponible', async () => {
        const productId = '1';
        const product = { id: productId, stock: 10 };

        jest.spyOn(repository, 'findOneBy').mockResolvedValue(product as any);
        const updateSpy = jest.spyOn(repository, 'update').mockResolvedValue(undefined);

        await service.buyProducts(productId);

        expect(updateSpy).toHaveBeenCalledWith(productId, { stock: 9 });
    });

    // 4. Prueba para verificar que el precio del producto se devuelve correctamente
    it('debería devolver el precio del producto', async () => {
        const productId = '1';
        const product = { id: productId, price: 100, stock: 10 };

        jest.spyOn(repository, 'findOneBy').mockResolvedValue(product as any);
        jest.spyOn(repository, 'update').mockResolvedValue(undefined);

        const result = await service.buyProducts(productId);

        expect(result).toBe(product.price);
    });

    // 5. Prueba para verificar que la función update no se llama si no hay stock
    it('no debería llamar a update si el stock es 0', async () => {
        const productId = '1';
        const product = { id: productId, stock: 0 };

        jest.spyOn(repository, 'findOneBy').mockResolvedValue(product as any);
        const updateSpy = jest.spyOn(repository, 'update');

        await expect(service.buyProducts(productId)).rejects.toThrow('Out of stock');
        expect(updateSpy).not.toHaveBeenCalled();
    });
});


describe('ProductService - uploadFile', () => {
    let service: ProductsService;
    let repository: Repository<Products>;
    let fileUploadService: FileUploadService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Products),
                    useValue: {
                        update: jest.fn(),
                    },
                },
                {
                    provide: FileUploadService,
                    useValue: {
                        uploadFile: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        repository = module.get<Repository<Products>>(getRepositoryToken(Products));
        fileUploadService = module.get<FileUploadService>(FileUploadService);
    });

    // 1. Prueba para verificar que la función uploadFile es llamada con los datos correctos   
    it('debería llamar a uploadFile con los datos de archivo correctos', async () => {
        const productId = '1';
        const fileDto = { fieldname: 'image', originalname: 'image.png', mimetype: 'image/png', size: 1024, buffer: Buffer.from('') };
        const mockUrl = 'http://example.com/image.png';

        jest.spyOn(fileUploadService, 'uploadFile').mockResolvedValue(mockUrl);
        jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });

        await service.uploadFile(fileDto, productId);

        expect(fileUploadService.uploadFile).toHaveBeenCalledWith(fileDto);
    });

    // 2. Prueba para verificar que el producto se actualiza con la URL de la imagen
    it('debería actualizar el producto con la URL de la imagen', async () => {
        const productId = '1';
        const fileDto = { fieldname: 'image', originalname: 'image.png', mimetype: 'image/png', size: 1024, buffer: Buffer.from('') };
        const mockUrl = 'http://example.com/image.png';

        jest.spyOn(fileUploadService, 'uploadFile').mockResolvedValue(mockUrl);
        const updateSpy = jest.spyOn(repository, 'update').mockResolvedValue(undefined);

        await service.uploadFile(fileDto, productId);

        expect(updateSpy).toHaveBeenCalledWith(productId, { imgUrl: mockUrl });
    });

    // 3. Prueba para verificar que la URL de la imagen es retornada correctamente
    it('debería devolver un objeto con la URL de la imagen', async () => {
        const productId = '1';
        const fileDto = { fieldname: 'image', originalname: 'image.png', mimetype: 'image/png', size: 1024, buffer: Buffer.from('') };
        const mockUrl = 'http://example.com/image.png';

        jest.spyOn(fileUploadService, 'uploadFile').mockResolvedValue(mockUrl);
        jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });

        const result = await service.uploadFile(fileDto, productId);

        expect(result).toEqual({ imgUrl: mockUrl });
    });

    // 4. Prueba para verificar que se llama a update con el ID correcto
    it('debería llamar a update con el ID de producto correcto', async () => {
        const productId = '1';
        const fileDto = { fieldname: 'image', originalname: 'image.png', mimetype: 'image/png', size: 1024, buffer: Buffer.from('') };
        const mockUrl = 'http://example.com/image.png';

        jest.spyOn(fileUploadService, 'uploadFile').mockResolvedValue(mockUrl);
        const updateSpy = jest.spyOn(repository, 'update').mockResolvedValue(undefined);

        await service.uploadFile(fileDto, productId);

        expect(updateSpy).toHaveBeenCalledWith(productId, expect.any(Object));
    });

    it('debería llamar a uploadFile antes que a update', async () => {
        const productId = '1';
        const fileDto = { fieldname: 'image', originalname: 'image.png', mimetype: 'image/png', size: 1024, buffer: Buffer.from('') };
        const mockUrl = 'http://example.com/image.png';
    
        let uploadFileCalled = false;
        let updateCalled = false;
    
        const uploadSpy = jest.spyOn(fileUploadService, 'uploadFile').mockImplementation(async () => {
            uploadFileCalled = true;
            return mockUrl;
        });
    
        const updateSpy = jest.spyOn(repository, 'update').mockImplementation(async () => {
            expect(uploadFileCalled).toBe(true);
            updateCalled = true;
            // Devolvemos un objeto que simula UpdateResult
            return { 
                affected: 1,
                generatedMaps: [],
                raw: {}
            };
        });
    
        await service.uploadFile(fileDto, productId);
    
        expect(uploadFileCalled).toBe(true);
        expect(updateCalled).toBe(true);
        expect(uploadSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();
    });
});
  
  