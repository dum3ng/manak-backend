import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WxController } from './wx/wx.controller';
import { WxModule } from './wx/wx.module';

@Module({
  imports: [WxModule],
  controllers: [AppController, WxController],
  providers: [AppService],
})
export class AppModule {}
