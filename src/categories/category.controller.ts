import { Controller, Get, Headers, Req } from '@nestjs/common';
import { ApiOkResponse, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CategoryService } from './category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly servis: CategoryService) { }

    @Get()
    @ApiHeader({ name: 'x-api-key', required: true, example: 'gaasda2d', description: 'Ключ для доступу' })
    @ApiHeader({ name: 'city-id', required: false, example: '1', description: 'ID міста користувача' })
    @ApiOkResponse({
        description: 'List of categories',
        schema: {
            example: {
                data: {
                    categories: [
                        {
                            id: 1,
                            name: "Концерти"
                        },
                    ],
                }
            },
        },
    })
    getCategories(
        @Headers('city-id') city_id: string,
        @Req() req: Request,
    ) {
        const cityId = Number(city_id);

        return this.servis.getCategories(req, cityId);
    }
}