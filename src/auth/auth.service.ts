import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as argon2 from 'argon2';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist';
import { UserService } from './../user/user.service';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './../user/entities/user.entity';
import { Exception } from 'src/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<Tokens> {
    const userExists = await this.userService.findByEmail(signupDto.email);
    if (userExists) throw new ConflictException(Exception.USER_EMAIL_EXISTS);

    const user = await this.userService.create({
      ...signupDto,
      password: await this.hashData(signupDto.password),
    });

    const tokens = await this.generateTokens(user.id, user.email, user.name);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new ForbiddenException(Exception.USER_CREDENTIAL_INVALID);
    }

    if (!(await this.verifyDataByHash(user.password, loginDto.password))) {
      throw new ForbiddenException(Exception.USER_CREDENTIAL_INVALID);
    }

    if (user.isLock) {
      throw new ForbiddenException(Exception.USER_IS_LOCK);
    }

    const tokens = await this.generateTokens(user.id, user.email, user.name);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    await this.userService.update(user.id, {
      lastLoginDate: new Date(),
    });

    return tokens;
  }

  async logout(user: UserEntity) {
    await this.userService.update(user.id, {
      refreshToken: null,
    });
  }

  async refreshTokens(user: UserEntity): Promise<Tokens> {
    const tokens = await this.generateTokens(user.id, user.email, user.name);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async verifyDataByHash(hash: string, data: string): Promise<boolean> {
    return await argon2.verify(hash, data);
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userService.update(userId, {
      refreshToken: await this.hashData(refreshToken),
    });
  }

  private async hashData(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  private async generateTokens(
    userId: number,
    email: string,
    name: string,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
      name,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
