import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { Exception } from 'src/exceptions';

export class CreateUserDto {
  @IsNotEmpty({ message: Exception.USER_EMAIL_EMPTY })
  @MaxLength(50, { message: Exception.USER_EMAIL_MAX_LENGTH })
  @IsEmail({}, { message: Exception.USER_EMAIL_FORMAT })
  email: string;

  @IsNotEmpty({ message: Exception.USER_PASSWORD_EMPTY })
  @Matches(/^\S*$/, { message: Exception.USER_PASSWORD_BLANK })
  password: string;

  @IsNotEmpty({ message: Exception.USER_NAME_EMPTY })
  @MaxLength(75, { message: Exception.USER_NAME_MAX_LENGTH })
  name: string;
}
