import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

const resourceNotFoundCode = 'P2025';

@Injectable()
export class UsersService {
  constructor(private _prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    if (!email || !password) {
      throw new BadRequestException('No details given');
    }

    const exitingUser = await this._prisma.user.findFirst({
      where: { email },
    });

    if (exitingUser) {
      throw new BadRequestException('User with given email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this._prisma.user.create({
        data: { email: email, password: hashedPassword },
      });
      return `Created new user with id ${user.id}`;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    const userList = await this._prisma.user.findMany({
      select: { email: true, id: true },
    });

    return userList;
  }

  async findOne(id: number) {
    const user = await this._prisma.user.findMany({
      select: { email: true },
      where: { id },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    try {
      const user = await this._prisma.user.update({
        data: updateUserDto,
        where: { id },
        select: { id: true },
      });

      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case resourceNotFoundCode:
            throw new BadRequestException('No user found');
          default:
            throw new BadRequestException('Updating user failed');
        }
      }
      throw new BadRequestException('Updating user failed');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
