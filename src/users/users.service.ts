import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    findAll() {
        this.logger.log('Fetching all users');
        return this.usersRepository.find();
    }
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        this.logger.log(`Creating user with email: ${createUserDto.email}`);

        const user = new User();
        user.email = createUserDto.email;
        const saltRounds = 10;
        user.pass = await bcrypt.hash(createUserDto.password, saltRounds);
        user.fullname = createUserDto.fullname;

        await this.usersRepository.save(user);

        this.logger.log(`User created with email: ${createUserDto.email} and id: ${user.id}`);

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
