// ws-client.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import * as WebSocket from 'ws';

interface PendingRequest {
    resolve: (data: any) => void;
    reject: (err: any) => void;
    timeout: NodeJS.Timeout;
}

@Injectable()
export class WsClientService implements OnModuleInit {
    constructor(private readonly redisService: RedisService) { }

    private ws: WebSocket;
    private pending = new Map<string, PendingRequest>();

    onModuleInit() {
        this.connect();
    }

    private async connect() {
        this.ws = new WebSocket(`${process.env.URL_SOCKET}`);

        this.ws.on('open', async () => {
            console.log('[WS] Connected ✅');

            const authPayload: Record<string, any> = {
                action: 'connect',
                login: "?",
            };

            const token = await this.redisService.getValue('tokenSocket');

            if (token) {
                authPayload.token = token;
            }

            this.ws.send(JSON.stringify(authPayload));
        });

        this.ws.on('message', async (data) => {
            try {
                const msg = JSON.parse(data.toString());

                if (msg?.r_code === 0 && !!msg?.user_id) {
                    await this.redisService.setValue('tokenSocket', msg.token)
                    return;
                }

                const { r_request_id } = msg;

                if (r_request_id && this.pending.has(`${r_request_id}`)) {
                    const pending = this.pending.get(`${r_request_id}`);

                    clearTimeout(pending?.timeout);

                    pending?.resolve(msg);

                    this.pending.delete(r_request_id);
                }
            } catch (e) {
                console.error('WS message error:', e);
            }
        });

        this.ws.on('close', () => {
            console.log('🔴 Connection closed');
        });

        this.ws.on('error', (err) => {
            console.error('❗ Error:', err.message);
        });
    }

    sendRequest(action: string, payload = {}, timeoutMs = 5000): Promise<any> {
        const request_id = Math.floor(100000 + Math.random() * 900000).toString();
        const message = JSON.stringify({ action, request_id: +request_id, ...payload });

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.pending.delete(request_id);

                reject(new Error('Timeout waiting for WebSocket response'));
            }, timeoutMs);

            this.pending.set(request_id, { resolve, reject, timeout });
            this.ws.send(message);
        });
    }
}
