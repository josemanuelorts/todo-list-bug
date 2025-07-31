import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsPublic } from 'src/auth/is-public.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/create')
    @IsPublic()
    async create(@Body() body) {
        return this.usersService.create(body);
    }


}
