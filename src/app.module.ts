import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { CategoriesModule } from './categories/category.module';
import { EventsModule } from './events/event.module';
import { CitiesModule } from './cities/city.module';
import { WsModule } from './ws/ws.module';
import { RedisModule } from './redis/redis.module';
import { AuthGuard } from './common/guards/auth';


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
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
  controllers: [AppController],
})

export class AppModule { }