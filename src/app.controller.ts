import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // 컨트롤러로서의 역할을 수행하겠다고 Nest.js에게 말하는 것
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
