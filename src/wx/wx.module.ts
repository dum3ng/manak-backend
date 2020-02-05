import { Module } from '@nestjs/common'
import { WxController } from './wx.controller'
import { WxCryptService } from './wxcrypt.service'

@Module({
  controllers: [WxController],
  providers: [WxCryptService],
})
export class WxModule {}
