import { Injectable } from '@nestjs/common'
import * as shajs from 'sha.js'
import * as Crypto from 'crypto-js'
import { shuffle } from 'lodash'
import * as xml2js from 'xml2js'

@Injectable()
export class WxCryptService {
  /**
   *         """用SHA1算法生成安全签名
        // @param token:  票据
        // @param timestamp: 时间戳
        // @param encrypt: 密文
        // @param nonce: 随机字符串
        // @return: 安全签名
   */
  getSHA1({ timestamp, nonce, encrypt }) {
    const list = [WxCryptService.token, timestamp, nonce, encrypt]
    list.sort()
    const sha1 = shajs('sha1')
    list.forEach(x => sha1.update(x))
    const hashcode = sha1.digest('hex')
    return hashcode
  }
  // @param sToken: 第三方平台申请时填写的接收消息的校验token
  // @param sEncodingAESKey: 第三方平台申请时填写的接收消息的加密symmetric_key
  // @param sAppid: 公众号第三方平台的appid
  // WXBizMsgCrypt(const std::string &sToken,
  // const std::string &sEncodingAESKey,
  // const std::string &sAppid)
  static token: string = process.env.TOKEN
  static encodingAESKey: string = process.env.ENCODING_AES_KEY
  static appId: string = process.env.APP_ID

  // 检验消息的真实性，并且获取解密后的明文
  // @param sMsgSignature: 签名串，对应URL参数的msg_signature
  // @param sTimeStamp: 时间戳，对应URL参数的timestamp
  // @param sNonce: 随机串，对应URL参数的nonce
  // @param sPostData: 密文，对应POST请求的数据
  decryptMsg({ msgSignature, timestamp, nonce, postData }): string {
    return ''
  }

  //将公众号回复用户的消息加密打包
  // @param sReplyMsg:公众号待回复用户的消息，xml格式的字符串
  // @param sTimeStamp: 时间戳，可以自己生成，也可以用URL参数的timestamp
  // @param sNonce: 随机串，可以自己生成，也可以用URL参数的nonce
  // @param sEncryptMsg: 加密后的可以直接回复用户的密文，包括msg_signature, timestamp, nonce,encrypt的xml格式的字符串,当return返回0时有效
  // return：成功0，失败返回对应的错误码
  // int EncryptMsg(const std::string &sReplyMsg,
  //   const std::string &sTimeStamp,
  //   const std::string &sNonce,
  //   std::string &sEncryptMsg);
  // encryptMsg({ timestamp, nonce }): string {}
}

class XmlParser {
  // xml消息模板
  static AES_TEXT_RESPONSE_TEMPLATE = `<xml>
  <Encrypt><![CDATA[%(msg_encrypt)s]]></Encrypt>
  <MsgSignature><![CDATA[%(msg_signaturet)s]]></MsgSignature>
  <TimeStamp>%(timestamp)s</TimeStamp>
  <Nonce><![CDATA[%(nonce)s]]></Nonce>
  </xml>`

  async extract(xmlText: string) {
    try {
      const obj = await xml2js.parseString(xmlText)
      return { encrypt: obj.Encrypt, toUserName: obj.ToUsername }
    } catch {
      return null
    }
  }
  /**
   *         """生成xml消息
        // @param encrypt: 加密后的消息密文
        // @param signature: 安全签名
        // @param timestamp: 时间戳
        // @param nonce: 随机字符串
        // @return: 生成的xml字符串
        """
   */
  generate({ encrypt, signature, timestamp, nonce }) {
    return `<xml>
      <Encrypt><![CDATA[${encrypt}]]></Encrypt>
      <MsgSignature><![CDATA[${signature}]]></MsgSignature>
      <TimeStamp>${timestamp}</TimeStamp>
      <Nonce><![CDATA[${nonce}]]></Nonce>
      </xml>`
  }
}

class PKCS7Encoder {
  static blockSize = 32

  /**
   *  对需要加密的明文进行填充补位
   * @param text: 需要进行填充补位操作的明文
   * @return: 补齐明文字符串
   */
  static encode(text: string) {
    const size = text.length
    const { blockSize } = PKCS7Encoder
    let toPad = blockSize - (size % blockSize)
    if (toPad === 0) toPad = blockSize
    const pad = String.fromCharCode(toPad)
    return text.padEnd(size + toPad, pad)
  }

  /**
   * 删除解密后明文的补位字符
   * @param decrypted 解密后的明文
   * @return 删除补位字符后的明文
   */
  static decode(decrypted: string) {
    let pad = decrypted.charCodeAt(decrypted.length - 1)
    if (pad < 1 || pad > 32) pad = 0
    return decrypted.substring(0, decrypted.length - pad)
  }
}

class Prpcrypt {
  key: string
  mode: string
  constructor(key: string) {
    this.key = key
    this.mode = ''
  }
  /**
   * 对明文进行加密
   * @param text  需要加密的明文
   * @param appId 加密得到的字符串
   */
  encrypt(text: string, appId: string) {
    text = this.getRandomStr() + ''
    text = PKCS7Encoder.encode(text)
    const result = Crypto.AES.encrypt(text, this.key)
    return btoa(result)
  }
  /**
   * 对解密后的明文进行补位删除
   *   @param text: 密文
   *   @return: 删除填充补位后的明文
   */
  decrypt(text: string, appId: string) {
    const result = Crypto.AES.decrypt(atob(text), this.key)
    // const pad = soc
  }

  getRandomStr() {
    const r1 = [48, 57]
    const r2 = [65, 90]
    const r3 = [97, 122]
    const nums = []
    ;[r1, r2, r3].forEach(r => {
      nums.concat([...Array(r[1] - r[0] + 1).keys()].map(x => x + r[0]))
    })
    const newArr = shuffle(nums)
    return newArr
      .slice(0, 16)
      .map((x: number) => String.fromCharCode(x))
      .join('')
  }
}
