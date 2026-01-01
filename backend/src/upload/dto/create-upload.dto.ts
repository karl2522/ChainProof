import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUploadDto {
    @IsNotEmpty()
    @IsString()
    fileName: string;

    @IsNotEmpty()
    @IsString()
    @Length(64, 64, { message: 'File hash must be exactly 64 characters long' })
    @Matches(/^[a-fA-F0-9]+$/, { message: 'File hash must be a valid hex string' })
    fileHash: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^0x[a-fA-F0-9]{64}$/, { message: 'Transaction hash must be a valid Ethereum transaction hash (0x + 64 hex chars)' })
    transactionHash: string;
}
