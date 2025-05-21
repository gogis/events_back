import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { EventService } from './event.service';


@Controller('events')
export class EventController {
    constructor(private readonly servis: EventService) { }

    @Get()
    getCategories(@Req() req: Request) {
        return this.servis.getEvents(req);
    }
}