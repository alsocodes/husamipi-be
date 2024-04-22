import { SetMetadata } from '@nestjs/common';
import 'dotenv/config';

export const jwtConstants = {
  access_token_secret: process.env.ACCESS_TOKEN_SECRET_KEY || 'access_secreet',
  access_token_expires: process.env.ACCESS_TOKEN_EXPIRES_IN || '10h',
  refresh_token_secret:
    process.env.REFRESH_TOKEN_SECRET_KEY || 'refresh_secreet',
  refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES_IN || '1h',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
