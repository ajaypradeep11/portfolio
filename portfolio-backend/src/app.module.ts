import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DogController } from './dog/dog.controller';

@Module({
  controllers: [AppController, DogController],
  providers: [AppService],
})
export class AppModule {}
