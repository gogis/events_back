import { Controller, Get } from '@nestjs/common';

import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
    constructor(private readonly servis: CategoryService) { }

    @Get()
    getCategories() {
        return this.servis.getCategories();
    }
}