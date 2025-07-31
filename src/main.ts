import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    const jwtService = app.get(JwtService);
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new AuthGuard(jwtService, reflector));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
