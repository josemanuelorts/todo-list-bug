import { Controller, Get } from '@nestjs/common';
import { IsPublic } from './auth/is-public.decorator';

@Controller()
export class AppController {
    constructor() {}

    @Get()
    @IsPublic()
    health() {
        return { success: true, message: 'API is running' };
    }
}
