import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private _prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    if (!email || !password) {
      throw new BadRequestException('No details given');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this._prisma.user.create({
        data: { email: email, password: hashedPassword },
      });
      return `Created new user with id ${user.id}`;
    } catch (err) {
      return 'error';
    }

    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
