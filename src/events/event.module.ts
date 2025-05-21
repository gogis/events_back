import { Module } from '@nestjs/common';

import { EventService } from './event.service';
import { CityService } from '../cities/city.service';
import { EventController } from './event.controller';

@Module({
    providers: [EventService, CityService],
    controllers: [EventController],
})

export class EventsModule { }