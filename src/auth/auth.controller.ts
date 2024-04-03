import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserModel } from '../user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: RegisterUserDto) {
    return await this.authService.register(user);
  }

  @Post('login')
  async login(@Body() user: Pick<UserModel, 'email' | 'password'>) {
    return this.authService.login(user);
  }
}
