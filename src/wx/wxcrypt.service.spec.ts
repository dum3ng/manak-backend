import { Test, TestingModule } from '@nestjs/testing'
import { WxCryptService } from './wxcrypt.service'

describe('WxService', () => {
  let service: WxCryptService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WxCryptService],
    }).compile()

    service = module.get<WxCryptService>(WxCryptService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
