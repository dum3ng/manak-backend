import { NestFactory } from '@nestjs/core'
import { text } from 'body-parser'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule)
  app.use(text({ type: 'text/*' }))
  await app.listen(3000)
}
bootstrap()
