import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { WsClientService } from '../ws/ws-client.service';
import { RedisService } from 'src/redis/redis.service';
import { EventService } from 'src/events/event.service';
import { filterCategoriesByEvent } from 'src/common/helpers/filter-categories';

@Injectable()
export class CategoryService {
    constructor(
        private readonly wsClient: WsClientService,
        private readonly redisService: RedisService,
        private readonly eventService: EventService
    ) { }

    async getCategories(req: Request, cityId: number = 0, all: number = 0) {
        const savedRaw = await this.redisService.getValue('categories');
        const eventsByCity = all === 1 ? null : await this.eventService.getEvents(req, { cityId }, true);

        if (savedRaw) {
            const saved = JSON.parse(savedRaw);

            this.wsClient.sendRequest('get_event_types', {
                language: 'uk',
                obtained_version: saved.version,
            }).then((latest) => {
                if (latest.version !== saved.version && latest?.event_types) {
                    this.redisService.setValue('categories', JSON.stringify({
                        version: latest.version,
                        event_types: latest.event_types,
                    }));
                }
            }).catch((err) => {
                console.error('[WS] Failed to update categories from socket:', err);
            });

            if (all === 1) {
                return {
                    data: {
                        categories: saved.event_types
                    }
                }
            }

            return {
                data: {
                    categories: filterCategoriesByEvent(eventsByCity?.events, saved.event_types)
                }
            };
        }

        const fresh = await this.wsClient.sendRequest('get_event_types', {
            language: 'uk',
            obtained_version: 0,
        });

        this.redisService.setValue('categories', JSON.stringify({
            version: fresh.version,
            event_types: fresh.event_types,
        }), 3600);

        if (all === 1) {
            return {
                data: {
                    categories: fresh.event_types
                }
            }
        }

        return {
            data: {
                categories: filterCategoriesByEvent(eventsByCity?.events, fresh.event_types)
            }
        };
    }
}