import { Controller, Get } from '@nestjs/common';
import { EventService } from './event.service';


@Controller('events')
export class EventController {
    constructor(private readonly servis: EventService) { }

    @Get()
    getCategories() {
        return this.servis.getEvents();
    }
}