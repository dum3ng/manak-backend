import * as xml2js from 'xml2js'

export class Message {
  toUserName: string
  fromUserName: string
  createTime: string
  msgType: string
  msgId: string
  constructor(xmlData: any) {
    const { xml } = xmlData
    this.toUserName = xml.ToUserName
    this.fromUserName = xml.FromUserName
    this.createTime = xml.CreateTime
    this.msgType = xml.Image
    this.msgId = xml.MsgId
  }
}

export class TextMessage extends Message {
  content: string

  constructor(xmlData: any) {
    super(xmlData)
    this.content = xmlData.xml.Content
  }
}

export class ImageMessage extends Message {
  picUrl: string
  mediaId: string
  constructor(xmlData: any) {
    super(xmlData)
    this.picUrl = xmlData.xml.PicUrl
    this.mediaId = xmlData.xml.MediaId
  }
}

export async function parseXml(data: string) {
  try {
    const parser = xml2js.Parser({ explicitArray: false })
    const obj = await parser.parseStringPromise(data)
    console.log(obj)
    switch (obj.xml.MsgType) {
      case 'text':
        return new TextMessage(obj)
      case 'image':
        return new ImageMessage(obj)
      default:
        return new Message(obj)
    }
  } catch (err) {
    console.log(err)
    return null
  }
}
