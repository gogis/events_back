import { Module, Global } from '@nestjs/common';
import { WsClientService } from './ws-client.service';

@Global()
@Module({
    providers: [WsClientService],
    exports: [WsClientService],
})

export class WsModule { }
