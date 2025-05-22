import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { EventService } from './event.service';
import { toNumberArray } from 'src/common/helpers/array-h';


@Controller('events')
export class EventController {
    constructor(private readonly servis: EventService) { }

    @Get()
    getCategories(
        @Req() req: Request,
        @Query('category') categoryRaw: string | string[],
        @Query('dateFrom') dateFrom: string | undefined = undefined,
        @Query('dateTo') dateTo: string | undefined = undefined,
        @Query('limit') limit: string = '1000',
        @Query('page') page: string = '1',
    ) {
        const categories = toNumberArray(categoryRaw);

        return this.servis.getEvents(req, {
            categories,
            dateFrom,
            dateTo,
            limit: +limit,
            page: +page
        });
    }
}