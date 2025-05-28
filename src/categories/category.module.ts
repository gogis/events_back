import { Module } from '@nestjs/common';

import { CategoryService } from './category.service';
import { EventService } from '../events/event.service';
import { CityService } from '../cities/city.service';
import { CategoryController } from './category.controller';

@Module({
    providers: [CategoryService, EventService, CityService],
    controllers: [CategoryController],
})

export class CategoriesModule { }