import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [PrismaService],
  imports: [UsersModule, AuthModule],
})
export class AppModule {}
