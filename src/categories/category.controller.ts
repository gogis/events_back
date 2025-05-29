import { Controller, Get, Headers, Req, Query } from '@nestjs/common';
import { ApiOkResponse, ApiHeader, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

import { CategoryService } from './category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly servis: CategoryService) { }

    @Get()
    @ApiHeader({ name: 'x-api-key', required: true, example: 'gaasda2d', description: 'Ключ для доступу' })
    @ApiHeader({ name: 'city-id', required: false, example: '1', description: 'ID міста користувача' })
    @ApiQuery({ name: 'all', required: false, example: 0, default: 0 })
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
        @Query('all') all: string = '0',
    ) {
        const cityId = Number(city_id);
        const isAll = Number(all);

        return this.servis.getCategories(req, cityId, isAll);
    }
}