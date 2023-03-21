import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from './../auth/guards/access-token.guard';
import { UserJSONInterceptor } from 'src/interceptors/user-json.interceptor';

@UseInterceptors(UserJSONInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Patch('is-lock/false')
  unlockUsers(@Body() userIds: number[]) {
    return this.userService.updateUsersLock(false, userIds);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('is-lock/true')
  lockUsers(@Body() userIds: number[]) {
    return this.userService.updateUsersLock(true, userIds);
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  removeUsers(@Body() userIds: number[]) {
    return this.userService.removeUsers(userIds);
  }
}
