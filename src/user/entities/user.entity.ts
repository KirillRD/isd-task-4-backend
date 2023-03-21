import { User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  email: string;
  password: string;
  name: string;
  signupDate: Date;
  lastLoginDate: Date;
  isLock: boolean;
  refreshToken: string | null;
}
