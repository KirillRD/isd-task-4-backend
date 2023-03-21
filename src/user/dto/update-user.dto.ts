import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Exception } from 'src/exceptions';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsDate({ message: Exception.USER_LAST_LOGIN_DATE_FORMAT })
  lastLoginDate?: Date;

  @IsOptional()
  @IsBoolean({ message: Exception.USER_IS_LOCK_FORMAT })
  isLock?: boolean;

  @IsOptional()
  @IsNotEmpty({ message: Exception.USER_REFRESH_TOKEN_EMPTY })
  @Matches(/^\S*$/, { message: Exception.USER_REFRESH_TOKEN_BLANK })
  refreshToken?: string | null;
}
