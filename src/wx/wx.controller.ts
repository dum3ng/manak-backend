import { Controller, Get, Req, Post } from '@nestjs/common'
import { Request } from 'express'
import * as shajs from 'sha.js'
import * as xml2js from 'xml2js'
import { parseXml, TextMessage, ImageMessage } from './receiver'
import * as replier from './replier'

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

  @Post()
  async handlePost(@Req() request: Request) {
    const data = request.body
    console.log('data', data)
    const msg = await parseXml(data)
    console.log(msg)
    if (!msg) return ''

    if (msg instanceof TextMessage) {
      const { toUserName, fromUserName } = msg
      const content = 'hello text'
      const reply = new replier.TextMessage(fromUserName, toUserName, content)
      return reply.send()
    }
    // if (msg instanceof ImageMessage) {
    //   const image = 'https://images.pexels.com/photos/3592285/pexels-photo-3592285.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    //   const { toUserName, fromUserName } = msg
    //   const reply = new replier.TextMessage(fromUserName, toUserName, )
    // }
    return 'success'
  }
}
