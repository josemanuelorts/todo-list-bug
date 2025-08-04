import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsPublic } from 'src/auth/is-public.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/create')
    @IsPublic()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }


}
