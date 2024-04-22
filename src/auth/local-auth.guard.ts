import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard untuk login
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
