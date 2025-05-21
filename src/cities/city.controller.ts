import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { CityService } from './city.service';


@Controller('cities')
export class CityController {
    constructor(private readonly servis: CityService) { }

    @Get()
    getCategories(@Req() req: Request) {
        return this.servis.getCitites(req);
    }
}