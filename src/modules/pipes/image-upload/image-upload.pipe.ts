import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ImageUploadPipe implements PipeTransform {
    private readonly allowedMimeTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/gif',
        'image/webp',
    ];

    private readonly maxSizeInBytes = 200000; //200KB

    transform(file: Express.Multer.File) {
        if(!file){
            throw new BadRequestException('No File Uploaded');
        }

        if(!this.allowedMimeTypes.includes(file.mimetype)){
            throw new BadRequestException('Invalid File Type');
        }

        if(file.size > this.maxSizeInBytes){
            throw new BadRequestException('File is too large');
        }

        return file;
    }
}