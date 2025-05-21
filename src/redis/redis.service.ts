import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly client: Redis;

    constructor() {
        const port = parseInt(process.env.REDIS_PORT ?? '6379', 10);

        this.client = new Redis({
            host: process.env.REDOS_HOST as string,
            port: port,
            // password: 'your_redis_password', 
        });

        this.client.on('connect', () => console.log('[Redis] Connected'));
        this.client.on('error', (err) => console.error('[Redis] Error', err));
    }

    getClient(): Redis {
        return this.client;
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async getValue(key: string): Promise<string | null> {
        const client = this.getClient();
        return client.get(key);
    }

    async setValue(key: string, value: string, ttlSeconds = 200): Promise<void> {
        const client = this.getClient();
        await client.set(key, value, 'EX', ttlSeconds);
    }
}
