import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultMessageDto } from '../helpers/interfaces/common';
import { MESSAGE_OK } from '../helpers/constants';
import SendCodeDto from './dto/send-code.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(
  new ValidationPipe({
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ type: DefaultMessageDto })
  @HttpCode(200)
  @Post('/sendCode')
  async sendCode(@Body() dto: SendCodeDto): Promise<DefaultMessageDto> {
    this.authService.sendCode(dto.email);
    return { ...MESSAGE_OK };
  }
}
