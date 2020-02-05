import { Controller, Get, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Post()
  postHello(@Req() req: Request) {
    console.log(req.body)
    return req.body
  }
}
