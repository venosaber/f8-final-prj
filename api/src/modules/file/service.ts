import {BaseService} from "@/modules/base/service";
import {FileEntity} from "@/modules/file/entity";
import {FileEntityRepository, FileI, FileReqI, FileServiceI} from "@/shares";
import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {ClsService} from "nestjs-cls";
import {CloudinaryService} from "@/modules/cloudinary/service";
import {UploadApiResponse} from "cloudinary";
import {FileReq} from "@/modules/file/dtos";

@Injectable()
export class FileService extends BaseService<FileEntity, FileReqI, FileI>
    implements FileServiceI
{
    constructor(
        @Inject(FileEntityRepository)
        protected repository: Repository<FileEntity>,
        protected readonly cls: ClsService,
        private readonly cloudinaryService: CloudinaryService,
    ) {
        super(repository, cls)
    }

    async uploadAndCreateFile(file: Express.Multer.File): Promise<FileI> {
        // upload the file to cloudinary
        const cloudinaryResponse: UploadApiResponse =
            await this.cloudinaryService.uploadFile(file);

        // from the result Cloudinary returns, create DTO to save into DB
        const createFileDto: FileReq = {
            publicId: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
            originalName: file.originalname,
            fileType: cloudinaryResponse.format,
            size: cloudinaryResponse.bytes,
        };

        // save into db
        return await this.create(createFileDto);
    }
}