import { Request } from 'express';

export const getIp = (req: Request) => process.env.NODE_ENV === "development" ? '178.136.111.74' : req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket?.remoteAddress || req.ip;