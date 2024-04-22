import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PublicRoute } from './constants';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshTokenGuard } from './jwt-refresh-auth.guard';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { ErrorHandling } from 'src/utils/error-handling';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Request() req, @Body() body: any) {
    const results = await this.authService.login(req.user, body);
    return {
      statusCode: 200,
      message: 'Login Berhasil',
      results,
    };
  }

  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh-login')
  async refreshLogin(@Request() req) {
    const { id, refreshToken } = req.user;
    const isApp = req.headers['user-agent'].includes('okhttp');
    const results = await this.authService.refreshLogin(
      id,
      refreshToken,
      isApp,
    );
    return {
      statusCode: 200,
      message: 'Refresh Login Berhasil',
      results,
    };
  }

  @Delete('/logout')
  async logout(@Request() req) {
    try {
      await this.authService.logout(req.user.id);
      return {
        statusCode: 200,
        message: 'Logout berhasil',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Logout gagal',
      };
    }
  }

  @Post('/change-password')
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDTO) {
    try {
      await this.authService.changePassword(req.user.id, dto);
      return {
        statusCode: 200,
        message: 'Successfull',
      };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
