import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/user-login.dto';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private _prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private async getUserPassword(email: string) {
    const user = await this._prisma.user.findFirst({ where: { email: email } });
    return user.password;
  }

  private async generateToken(email: string, temp = false) {
    if (temp) {
      return jwt.sign({ email }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXP_TIME,
      });
    }

    return jwt.sign({ email }, process.env.JWT_REFRESH_TOKEN);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    if (!email || !password) {
      throw new ForbiddenException('Missing details');
    }

    const dbPassword = await this.getUserPassword(email);
    const passwordMatch = await bcrypt.compare(password, dbPassword);

    if (!passwordMatch) {
      throw new ForbiddenException('Wrong password');
    }

    const tokens = {
      accessToken: await this.generateToken(email, true),
      refreshToken: await this.generateToken(email),
    };

    try {
      const tokenData = await this._prisma.refreshToken.create({
        data: { token: tokens.refreshToken },
      });
      return tokens;
    } catch (err) {
      throw new BadRequestException('Login failed');
    }
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new BadRequestException('Missing token');
    }

    try {
      const data = jwt.verify(token, process.env.JWT_REFRESH_TOKEN) as {
        email: string;
      };
      const dbToken = await this._prisma.refreshToken.findFirst({
        where: { token },
      });

      if (dbToken) {
        return this.generateToken(data.email, true);
      }

      throw new Error('Could not find token');
    } catch (e) {
      throw new ForbiddenException('Invalid token');
    }
  }

  async logout(token: string) {
    if (!token) {
      throw new BadRequestException('Missing token');
    }

    try {
      const data = jwt.verify(token, process.env.JWT_REFRESH_TOKEN) as {
        email: string;
      };
      const dbToken = await this._prisma.refreshToken.deleteMany({
        where: { token },
      });

      if (dbToken.count) {
        return `User ${data.email} logged out successfully`;
      }

      return `User ${data.email} was already logged out`;
    } catch (e) {
      throw new ForbiddenException('Invalid token');
    }

    return 'logout';
  }

  getProtected() {
    return `Logged as ${this.request['user']}`;
  }
}
