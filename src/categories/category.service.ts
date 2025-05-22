import { Injectable } from '@nestjs/common';

import { WsClientService } from '../ws/ws-client.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CategoryService {
    constructor(
        private readonly wsClient: WsClientService,
        private readonly redisService: RedisService
    ) { }

    async getCategories() {
        const savedRaw = await this.redisService.getValue('categories');

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

            return {
                data: {
                    categories: saved.event_types
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

        return {
            data: {
                categories: fresh.event_types
            }
        };
    }
}