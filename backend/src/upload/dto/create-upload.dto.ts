import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUploadDto {
    @IsNotEmpty()
    @IsString()
    fileName: string;

    @IsNotEmpty()
    @IsString()
    fileHash: string;

    @IsNotEmpty()
    @IsString()
    transactionHash: string;
}
