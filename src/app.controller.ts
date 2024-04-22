import { Controller, Get, Param, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicRoute } from './auth/constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @PublicRoute()
  @Get('img/:key')
  getImage(@Response() res, @Param('key') key: string) {
    // authorizasi

    return res.sendFile(`/${key}`, { root: 'public' });
  }
}
