import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../types';
import { Exception } from 'src/exceptions';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
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
      throw new UnauthorizedException(Exception.ACCESS_TOKEN_INVALID);
    }

    return user;
  }
}
