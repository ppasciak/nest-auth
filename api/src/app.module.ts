import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  providers: [PrismaService],
  imports: [UsersModule],
})
export class AppModule {}
