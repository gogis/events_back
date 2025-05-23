import { Injectable } from '@nestjs/common';
import { Request } from 'express';


import { WsClientService } from '../ws/ws-client.service';
import { RedisService } from 'src/redis/redis.service';
import { CityService } from '../cities/city.service';
import { filterEvents } from 'src/common/helpers/filter-events';

@Injectable()
export class EventService {
    constructor(
        private readonly wsClient: WsClientService,
        private readonly redisService: RedisService,
        private readonly cityServis: CityService
    ) { }

    async getEvents(req: Request, {
        categories = [],
        dateFrom,
        dateTo,
        cityId,
        limit = 1000,
        page = 1
    }: {
        categories?: number[];
        dateFrom?: string;
        dateTo?: string;
        cityId?: number;
        limit?: number;
        page?: number;
    },
        isEventsAll = false
    ) {
        try {
            const cities = !!cityId ? { data: { id: cityId } } : await this.cityServis.getCitites(req, true);
            const savedRaw = await this.redisService.getValue(`event_${cities.data.id}`);

            if (savedRaw) {
                const saved = JSON.parse(savedRaw);

                this.wsClient.sendRequest('get_events', {
                    city_id: cities.data.id,
                    version: saved.version,
                }).then((latest) => {
                    if (latest.version !== saved.version && latest?.events?.length) {
                        const deleted: number[] = latest.events.filter((event: { id: number, is_deleted: boolean }) => event.is_deleted).map((el: { id: number }) => el.id);
                        const updated: any[] = latest.events.filter((event: { is_deleted: boolean }) => !event.is_deleted);

                        let newListEvent: any[] = [];

                        if (deleted.length) {
                            newListEvent = saved.filter((event: { id: number }) => !deleted.includes(event.id))
                        }

                        if (updated) {
                            const updatesMap = new Map<number, any>();

                            for (const event of updated) {
                                updatesMap.set(event.id, event);
                            }

                            newListEvent = (newListEvent.length ? newListEvent : latest.events).map((event: any) => updatesMap.has(event.id) ? { ...event, ...updatesMap.get(event.id)! } : event);

                            for (const [id, newEvent] of updatesMap.entries()) {
                                if (!latest.events.find((event: { id: number }) => event.id === id)) {
                                    newListEvent.push(newEvent);
                                }
                            }
                        }

                        this.redisService.setValue('categories', JSON.stringify({
                            version: latest.version,
                            event_types: newListEvent,
                        }));
                    }
                }).catch((err) => {
                    console.error('[WS] Failed to update categories from socket:', err);
                });

                if (isEventsAll) {
                    return {
                        events: saved.events
                    }
                }

                return {
                    data: {
                        ...filterEvents(saved.events, {
                            categories,
                            dateFrom,
                            dateTo,
                            limit,
                            page
                        })
                    }
                }
            }

            const fresh = await this.wsClient.sendRequest('get_events', {
                city_id: cities.data.id,
                version: 0,
            });

            this.redisService.setValue(`event_${cities.data.id}`, JSON.stringify({
                version: fresh.version,
                events: fresh.events
            }), 3600);

            if (isEventsAll) {
                return {
                    events: fresh.events
                }
            }

            return {
                data: {
                    ...filterEvents(fresh.events, {
                        categories,
                        dateFrom,
                        dateTo,
                        limit,
                        page
                    })
                }
            }
        } catch (error) {
            console.error('Error in getEvents:', error);
        }
    }

    async getOneById(req: Request, id: number, cityId: number) {
        const savedRawEvents = await this.redisService.getValue(`event_${cityId}`);

        if (savedRawEvents) {
            const savedEvents = JSON.parse(savedRawEvents);

            return {
                data: {
                    event: savedEvents.events.find((event: { id: number }) => event.id === id)
                }
            }
        }

        const eventsServer = await this.getEvents(req, { cityId }, true);

        if (eventsServer?.events) {
            return {
                data: {
                    event: eventsServer.events.find((event: { id: number }) => event.id === id)
                }
            }
        }
    }
}