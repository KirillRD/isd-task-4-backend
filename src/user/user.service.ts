import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    createUserDto.name = createUserDto.name.trim();
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateUsersLock(isLock: boolean, userIds: number[]) {
    return this.prisma.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        isLock,
      },
    });
  }

  async removeUsers(userIds: number[]) {
    return this.prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }
}
