import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UploadService } from './upload.service';

@Controller('api')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('upload')
    async create(@Body() createUploadDto: CreateUploadDto) {
        try {
            const upload = await this.uploadService.create(createUploadDto);
            return {
                success: true,
                data: upload,
            };
        } catch (error) {
            // Handle duplicate transaction hash or file hash
            if (error.code === 'P2002') {
                throw new HttpException(
                    'File or transaction already exists',
                    HttpStatus.CONFLICT,
                );
            }
            throw new HttpException(
                'Failed to create upload record',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('history')
    async findAll() {
        const uploads = await this.uploadService.findAll();
        return uploads;
    }

    @Get('verify/:hash')
    async verify(@Param('hash') hash: string) {
        const upload = await this.uploadService.findByHash(hash);

        if (!upload) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }

        return upload;
    }
}
