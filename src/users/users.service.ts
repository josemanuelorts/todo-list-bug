import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(body: any) {
        this.logger.log(`Creating user with email: ${body.email}`);

        const user = new User();
        user.email = body.email;
        const saltRounds = 10;
        user.pass = await bcrypt.hash(body.password, saltRounds);
        user.fullname = body.fullname;

        await this.usersRepository.save(user);

        this.logger.log(`User created with email: ${body.email} and id: ${user.id}`);

        return user;
    }

    async findOne(email: string) {
        this.logger.log(`Searching for user with email: ${email}`);

        const user = await this.usersRepository.findOneBy({
            email,
        });

        if (user) {
            this.logger.log(`User found with email: ${email}`);
        } else {
            this.logger.warn(`User not found with email: ${email}`);
        }

        return user;
    }

}
