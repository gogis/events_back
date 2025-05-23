import { Controller, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';

import { CityService } from './city.service';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
    constructor(private readonly servis: CityService) { }

    @Get()
    @ApiHeader({ name: 'x-api-key', required: true, example: 'gaasda2d', description: 'Ключ для доступу' })
    @ApiOkResponse({
        description: 'List of cities',
        schema: {
            example: {
                data: {
                    cities: [
                        {
                            id: 15,
                            version: 4302,
                            name: "Вінниця"
                        },
                    ],
                }
            },
        },
    })
    getCategories(@Req() req: Request) {
        return this.servis.getCitites(req);
    }
}