import { Injectable } from '@nestjs/common';
import { Request } from 'express';


import { WsClientService } from '../ws/ws-client.service';
import { RedisService } from 'src/redis/redis.service';
import { CityService } from '../cities/city.service';

@Injectable()
export class EventService {
    constructor(
        private readonly wsClient: WsClientService,
        private readonly redisService: RedisService,
        private readonly cityServis: CityService
    ) { }

    async getEvents(req: Request) {
        try {
            const cities = await this.cityServis.getCitites(req, true);
            const savedRaw = await this.redisService.getValue(`eve_${cities.data.id}`);

            if (savedRaw) {
                const saved = JSON.parse(savedRaw);

                this.wsClient.sendRequest('get_events', {
                    city_id: cities.data.id,
                    version: saved.version,
                }).then((latest) => {
                    if (latest.version !== saved.version) {
                        console.log("latest events: ", latest);

                        // this.redisService.setValue('categories', JSON.stringify({
                        //     version: latest.version,
                        //     event_types: latest.event_types,
                        // }));
                    }
                }).catch((err) => {
                    console.error('[WS] Failed to update categories from socket:', err);
                });

                return {
                    data: {
                        events: saved.events
                    }
                }
            }

            const fresh = await this.wsClient.sendRequest('get_events', {
                city_id: cities.data.id,
                version: 3608,
            });

            console.log('fresh: ', fresh);

            this.redisService.setValue(`eve_${cities.data.id}`, JSON.stringify({
                version: fresh.version,
                events: fresh.events
            }), 3600);

            return {
                data: {
                    events: fresh.events
                }
            }
        } catch (error) {
            console.error('Error in getEvents:', error);
        }
    }
}