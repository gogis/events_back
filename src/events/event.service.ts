import { Injectable } from '@nestjs/common';

import { WsClientService } from '../ws/ws-client.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class EventService {
    constructor(
        private readonly wsClient: WsClientService,
        private readonly redisService: RedisService
    ) { }

    getEvents() {
        return this.wsClient.sendRequest('get_all_events', {
            city_id: 2,
            version: 0,
        });
    }
}