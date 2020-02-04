import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import * as shajs from 'sha.js'

@Controller('api/wx')
export class WxController {
  @Get()
  handleCheck(@Req() request: Request): string {
    const { signature, echostr, timestamp, nonce } = request.query
    const token = process.env.TOKEN
    const list = [token, timestamp, nonce]
    list.sort()
    const sha1 = shajs('sha1')
    list.forEach(x => sha1.update(x))
    const hashcode = sha1.digest('hex')
    if (hashcode === signature) return echostr
    else return ''
  }
}
