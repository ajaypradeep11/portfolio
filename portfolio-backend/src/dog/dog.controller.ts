import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from './user.decorator';
@Controller('dog')
export class DogController {
    @Get('lol')
    async findOne(@User('firstName') firstName: string) {
        console.log(`Hello ${firstName}`);
    }
}
