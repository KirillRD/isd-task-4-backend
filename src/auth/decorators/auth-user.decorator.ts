import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from './../../user/entities/user.entity';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserEntity;
  },
);
