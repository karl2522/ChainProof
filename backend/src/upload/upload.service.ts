import { Injectable } from '@nestjs/common';
import { Upload } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUploadDto } from './dto/create-upload.dto';

@Injectable()
export class UploadService {
    constructor(private prisma: PrismaService) { }

    async create(createUploadDto: CreateUploadDto): Promise<Upload> {
        return this.prisma.upload.create({
            data: createUploadDto,
        });
    }

    async findAll(): Promise<Upload[]> {
        return this.prisma.upload.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findByHash(hash: string): Promise<Upload | null> {
        return this.prisma.upload.findUnique({
            where: {
                fileHash: hash,
            },
        });
    }
}
