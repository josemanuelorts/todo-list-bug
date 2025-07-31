import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(email: string, pass: string): Promise<any> {
        this.logger.log(`Attempting sign-in for email: ${email}`);

        const user = await this.usersService.findOne(email);

        if (!user) {
            this.logger.warn(`User not found: ${email}`);
            throw new UnauthorizedException();
        }

        const isPasswordValid = await bcrypt.compare(pass, user.pass);
        if (!isPasswordValid) {
            this.logger.log(`Invalid password for user with email ${email}`);
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload, { expiresIn: '1h' }),
        };
    }

}
