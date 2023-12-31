import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/user-login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  create(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('/refresh-token')
  refreshToken(@Body() data: { token: string }) {
    return this.authService.refreshToken(data.token);
  }

  @Post('/logout')
  logout(@Body() data: { token: string }) {
    return this.authService.logout(data.token);
  }

  @Get(['/protected/:slug', '/protected'])
  getProtected() {
    return this.authService.getProtected();
  }
}
