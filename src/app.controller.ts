import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('todos')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  async getUsers(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.appService.getUsers(limit, page);
  }

  @Get('heavytask')
  @HttpCode(HttpStatus.OK)
  doHeavyTask(@Query('times', ParseIntPipe) times: number) {
    return this.appService.doHeavyTask(times);
  }

  @Get('heavyinterval')
  @HttpCode(HttpStatus.OK)
  doHeavyTaskInterval(@Query('action', ParseIntPipe) action: 0 | 1) {
    return this.appService.doHeavyTaskInterval(action);
  }

  @Get('error')
  generateError(@Query('code', ParseIntPipe) code: number) {
    return this.appService.generateError(code);
  }
}
