import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import { Access } from './access.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDTO } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findUsernameOrEmail(username);

    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;

    return user;
  }

  async login(
    user: any,
    { from, deviceId, deviceName }: any,
    isApp: boolean = false,
  ) {
    if (user.role.name === 'superadmin') {
      user.role.accesses = Object.values(Access);
    }

    const { accessToken, refreshToken } = await this.generateToken({
      username: user.username,
      sub: user.id,
      accesses: user.role.accesses,
      divisions: user.userDivision?.map(({ division }) => ({ ...division })),
    });

    // TODO: get IP login
    await this.userService.updateRefreshToken(user.id, refreshToken, isApp);

    // await this.prisma.userAuthLog.create({
    //   data: {
    //     status: true,
    //     id: user.id,
    //     ip: '0.0.0.0',
    //   },
    // });

    delete user.password;
    return {
      refreshToken: refreshToken,
      accessToken: accessToken,
      user: {
        ...user,
        divisions: user.userDivision?.map(({ division }) => ({ ...division })),
        userDivision: undefined,
      },
    };
  }

  async generateToken(data: any) {
    const {
      access_token_expires,
      access_token_secret,
      refresh_token_expires,
      refresh_token_secret,
    } = jwtConstants;

    const accessToken = this.jwtService.sign(
      {
        ...data,
      },
      {
        secret: access_token_secret,
        expiresIn: access_token_expires,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: data.sub,
      },
      {
        secret: refresh_token_secret,
        expiresIn: refresh_token_expires,
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshLogin(id: number, refreshToken: string, isApp: boolean = false) {
    const user = await this.userService.findById(id);

    if (user.role.name === 'superadmin') {
      user.role.accesses = Object.values(Access);
    }

    // console.log(isApp ? 1 : 0);
    const refreshTokenMatches =
      user.refreshToken === refreshToken ||
      (user.lastRefreshToken === refreshToken &&
        Date.now() - new Date(user.updatedAt).getTime() < 10000);

    if (!refreshTokenMatches)
      throw new UnauthorizedException('Access Denied 1');

    const tokens = await this.generateToken({
      username: user.username,
      sub: user.id,
      accesses: user.role.accesses,
    });

    await this.userService.updateRefreshToken(
      user.id,
      tokens.refreshToken,
      isApp,
    );

    return {
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      user: user,
    };
  }

  async logout(id: number) {
    return await this.userService.updateRefreshToken(id, null);
  }

  async changePassword(
    userId: number,
    { oldPassword, newPassword }: ChangePasswordDTO,
  ) {
    if (oldPassword === newPassword)
      throw new BadRequestException(
        'Password baru harus berbeda dengan password lama',
      );

    const user = await this.userService.findById(userId);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new UnauthorizedException('Password lama tidak sesuai');

    const pass = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(user.id, pass);
  }
}
