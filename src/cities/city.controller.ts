import { Controller, Get, Req, Headers } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';

import { CityService } from './city.service';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
    constructor(private readonly servis: CityService) { }

    @Get()
    @ApiHeader({ name: 'x-api-key', required: true, example: 'gaasda2d', description: 'Ключ для доступу' })
    @ApiHeader({ name: 'city-id', required: false, example: '1', description: 'ID міста користувача' })
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
    getCategories(
        @Req() req: Request,
        @Headers('city-id') city_id: string = '0',
    ) {
        const cityId = Number(city_id);

        return this.servis.getCitites(req, false, 0, cityId);
    }
}