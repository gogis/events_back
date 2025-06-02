import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { WsClientService } from '../ws/ws-client.service';
import { RedisService } from 'src/redis/redis.service';
import { getIp } from 'src/common/helpers/ip';

@Injectable()
export class CityService {
    constructor(
        private readonly wsClient: WsClientService,
        private readonly redisService: RedisService
    ) { }

    async getCitites(req: Request, isFirst = false, cityId?: number, activeCitiId?: number) {
        try {
            const ip = getIp(req);
            const savedRaw = await this.redisService.getValue(`cities_by_${ip}`);

            if (savedRaw) {
                const saved = JSON.parse(savedRaw);

                if (!!cityId) {
                    return {
                        data: saved.cities.find((el: { id: number }) => el.id == cityId)
                    };
                }

                if (isFirst) {
                    return {
                        data: saved.cities[0],
                    };
                }

                return {
                    data: {
                        cities: saved.cities,
                        activeCity: saved.cities.find((el: { id: number }) => el.id === activeCitiId) || saved.cities?.[0] 
                    }
                };
            }

            const response = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`);

            if (!response.ok) {
                throw new Error(`ipinfo.io responded with status ${response.status}`);
            }

            const data = await response.json();
            const [lat, lon] = (data.loc ?? '48.918891,24.6765683').split(',').map(Number);

            const fresh = await this.wsClient.sendRequest('get_nearby_cities', {
                search_string: '',
                lat: lat,
                lon: lon,
                obtained_version: 0,
            });

            this.redisService.setValue(`cities_by_${ip}`, JSON.stringify({
                cities: fresh.cities
            }), 60);

            if (!!cityId) {
                return {
                    data: fresh.cities.find((el: { id: number }) => el.id == cityId)
                };
            }

            if (isFirst) {
                return {
                    data: fresh.cities[0]
                };
            }

            return {
                data: {
                    cities: fresh.cities,
                    activeCity: fresh.cities.find((el: { id: number }) => el.id === activeCitiId) || fresh.cities[0]
                }
            };
        } catch (error) {
            console.error('Error in getCities:', error);

            const res = await this.wsClient.sendRequest('get_nearby_cities', {
                lat: 48.918891,
                lon: 24.6765683,
                obtained_version: 0,
            });

            if (isFirst) {
                return {
                    data: res.cities[0]
                };
            }

            return {
                data: {
                    cities: res.cities
                }
            };
        }
    }
}