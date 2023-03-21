import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Exception } from 'src/exceptions';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any, info: any) {
    this.checkException(err);
    this.checkException(info);
    return user;
  }

  checkException(exception: any) {
    if (exception) {
      if (exception.constructor.name == 'TokenExpiredError') {
        throw new UnauthorizedException(Exception.REFRESH_TOKEN_EXPIRATION);
      }
      throw exception;
    }
  }
}
