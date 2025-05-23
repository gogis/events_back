import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiHeader, ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly servis: CategoryService) { }

    @Get()
    @ApiHeader({ name: 'x-api-key', required: true, example: 'gaasda2d', description: 'Ключ для доступу' })
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
    getCategories() {
        return this.servis.getCategories();
    }
}