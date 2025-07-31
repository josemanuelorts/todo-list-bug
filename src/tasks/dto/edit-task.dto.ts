import { IsUUID, IsNotEmpty, IsBoolean, IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsBoolean()
    done: boolean;

    @IsOptional()
    @IsString()
    dueDate?: string;
}
