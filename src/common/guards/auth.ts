import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = request.headers['x-api-key'];

        if (apiKey && apiKey === process.env.API_KEY) {
            return true;
        }

        return false;
    }
}