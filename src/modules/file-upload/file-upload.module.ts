import { Module } from "@nestjs/common";
import { CloudinaryService } from "../service/cloudinary/cloudinary.service";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadService } from "./file-upload.service";

@Module({
    controllers: [FileUploadController],
    providers: [FileUploadService, CloudinaryService],
    exports: [FileUploadService]
})

export class FileUploadModule {}