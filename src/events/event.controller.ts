import { Controller, Get, Param, Query, Req, BadRequestException, Headers } from '@nestjs/common';
import { ApiQuery, ApiHeader, ApiOkResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';

import { EventService } from './event.service';
import { toNumberArray } from 'src/common/helpers/array-h';

@ApiTags('Events')
@Controller('events')
export class EventController {
    constructor(private readonly servis: EventService) { }

    @Get()
    @ApiQuery({ name: 'category', required: false, example: 1 })
    @ApiQuery({ name: 'dateFrom', required: false, example: '20-05-2025' })
    @ApiQuery({ name: 'dateTo', required: false, example: '20-07-2025' })
    @ApiQuery({ name: 'limit', required: false, example: 100, default: 1000 })
    @ApiQuery({ name: 'page', required: false, example: 1, default: 1 })
    @ApiHeader({ name: 'city-id', required: false, example: '1', description: 'ID міста користувача' })
    @ApiHeader({ name: 'x-api-key', required: true, example: 'gaasda2d', description: 'Ключ для доступу' })
    @ApiOkResponse({
        description: 'List of events',
        schema: {
            example: {
                data: {
                    events: [
                        {
                            "title": "Вистава \"За двома зайцями\"",
                            "description": "<p style=\"text-align: justify;\"><strong>Тривалість: </strong>130 хв</p>\r\n<p style=\"text-align: justify;\"><strong>Про подію</strong></p>\r\n<p style=\"text-align: justify;\">Отже, хто на кого полює? Свирид Голохвостий женеться за статками пана Сірка. А ще за ніжною, хай і бідною, кралею Галею. Але і жінки у цій виставі тримають руку на пульсі. Проня Прокопівна страх як любить \"розумного і багатого\" нареченого, а її тітка Секлета Лемириха хоче будь-що урвати собі зятя-панича, який почав ходити до її доньки Галі. Але заєць тут один на двох - і той Голохвостий.</p>\r\n<p style=\"text-align: justify;\"><strong>Квитки можна придбати в касі театру або за вказаним посиланням</strong></p>",
                            "types": [
                                3
                            ],
                            "photo": "https://eu-central-1.linodeobjects.com/list/production/afisha/26159/67404b1630c8a.png",
                            "start": "18:00",
                            "price": 150,
                            "location_address": "",
                            "links": [
                                {
                                    "title": "Купити квиток Kontramarka.ua",
                                    "url": "https://if.kontramarka.ua/uk/za-dvoma-zajcami-45063.html"
                                }
                            ],
                            "contacts": [],
                            "date": "2025-05-29",
                            "end_date": "2025-05-29",
                            "venues": [
                                {
                                    "id": 168051,
                                    "title": "{\"name\":\"Івано-Франківський національний академічний драматичний театр ім. Івана Франка\",\"logo\":\"https://eu-central-1.linodeobjects.com/list/production/9104/logo/big/\",\"logo_sm\":\"https://eu-central-1.linodeobjects.com/list/production/9104/logo/thumb/\"}",
                                    "name": "Івано-Франківський національний академічний драматичний театр ім. Івана Франка"
                                }
                            ],
                            "organizers": [],
                            "id": 29,
                            "is_deleted": false
                        },
                    ],
                    currentCity: {
                        id: 1,
                        name: "ІФ",
                    },
                    totalPages: 20
                }
            },
        },
    })
    getCategories(
        @Req() req: Request,
        @Headers('city-id') cityId: string = '0',
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
            cityId: Number(cityId),
            limit: +limit,
            page: +page
        });
    }


    @Get('/:id')
    @ApiHeader({ name: 'city-id', required: false, example: '1', description: 'ID міста користувача' })
    @ApiParam({ name: 'id', required: true, type: Number, example: 1, description: 'ID  події' })
    @ApiHeader({ name: 'x-api-key', required: true, example: 'gaasda2d', description: 'Ключ для доступу' })
    @ApiOkResponse({
        description: 'Event',
        schema: {
            example: {
                data: {
                    event: {
                        "title": "Вистава \"За двома зайцями\"",
                        "description": "<p style=\"text-align: justify;\"><strong>Тривалість: </strong>130 хв</p>\r\n<p style=\"text-align: justify;\"><strong>Про подію</strong></p>\r\n<p style=\"text-align: justify;\">Отже, хто на кого полює? Свирид Голохвостий женеться за статками пана Сірка. А ще за ніжною, хай і бідною, кралею Галею. Але і жінки у цій виставі тримають руку на пульсі. Проня Прокопівна страх як любить \"розумного і багатого\" нареченого, а її тітка Секлета Лемириха хоче будь-що урвати собі зятя-панича, який почав ходити до її доньки Галі. Але заєць тут один на двох - і той Голохвостий.</p>\r\n<p style=\"text-align: justify;\"><strong>Квитки можна придбати в касі театру або за вказаним посиланням</strong></p>",
                        "types": [
                            3
                        ],
                        "photo": "https://eu-central-1.linodeobjects.com/list/production/afisha/26159/67404b1630c8a.png",
                        "start": "18:00",
                        "price": 150,
                        "location_address": "",
                        "links": [
                            {
                                "title": "Купити квиток Kontramarka.ua",
                                "url": "https://if.kontramarka.ua/uk/za-dvoma-zajcami-45063.html"
                            }
                        ],
                        "contacts": [],
                        "date": "2025-05-29",
                        "end_date": "2025-05-29",
                        "venues": [
                            {
                                "id": 168051,
                                "title": "{\"name\":\"Івано-Франківський національний академічний драматичний театр ім. Івана Франка\",\"logo\":\"https://eu-central-1.linodeobjects.com/list/production/9104/logo/big/\",\"logo_sm\":\"https://eu-central-1.linodeobjects.com/list/production/9104/logo/thumb/\"}",
                                "name": "Івано-Франківський національний академічний драматичний театр ім. Івана Франка"
                            }
                        ],
                        "organizers": [],
                        "id": 29,
                        "is_deleted": false
                    },
                }
            },
        },
    })
    getOneById(
        @Req() req: Request,
        @Param('id') id: string,
        @Headers('city-id') city_id: string,
    ) {
        const parsedId = Number(id);
        const cityId = Number(city_id);

        if (isNaN(parsedId)) {
            throw new BadRequestException('ID must be a number');
        }


        if (!Number.isInteger(parsedId)) {
            throw new BadRequestException('ID must be an integer');
        }

        return this.servis.getOneById(req, parsedId, cityId)
    }
}