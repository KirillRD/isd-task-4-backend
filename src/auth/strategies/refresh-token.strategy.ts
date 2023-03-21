import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './../auth.service';
import { Request } from 'express';
import { Exception } from 'src/exceptions';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    config: ConfigService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userService.findById(payload.sub);

    if (user && user.isLock) {
      throw new UnauthorizedException(Exception.USER_IS_LOCK);
    }

    if (
      !user ||
      payload.email != user.email ||
      payload.name != user.name ||
      !user.refreshToken ||
      user.isLock
    ) {
      throw new UnauthorizedException(Exception.REFRESH_TOKEN_INVALID);
    }

    const refreshToken = request.headers.authorization
      ?.replace('Bearer', '')
      .trim();
    if (
      !refreshToken ||
      !(await this.authService.verifyDataByHash(
        user.refreshToken,
        refreshToken,
      ))
    ) {
      throw new UnauthorizedException(Exception.REFRESH_TOKEN_INVALID);
    }

    return user;
  }
}
