import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CategoriesModule } from './categories/category.module';
import { EventsModule } from './events/event.module';
import { CitiesModule } from './cities/city.module';
import { WsModule } from './ws/ws.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    WsModule,
    CategoriesModule,
    EventsModule,
    CitiesModule
  ],
  controllers: [AppController],
})

export class AppModule { }