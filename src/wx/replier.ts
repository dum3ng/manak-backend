export class Message {
  toUserName: string
  fromUserName: string
  createTime: number

  constructor(toUserName: string, fromUserName: string) {
    this.toUserName = toUserName
    this.fromUserName = fromUserName
    this.createTime = Date.now()
  }
  // send() {}
}

export class TextMessage extends Message {
  content: string
  constructor(toUserName, fromUserName, content) {
    super(toUserName, fromUserName)
    this.content = content
  }

  send() {
    const { toUserName, fromUserName, createTime, content } = this
    return `
        <xml>
        <ToUserName><![CDATA[${toUserName}]]></ToUserName>
        <FromUserName><![CDATA[${fromUserName}]]></FromUserName>
        <CreateTime>${createTime}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${content}]]></Content>
        </xml>
          `
  }
}

export class ImageMessage extends Message {
  mediaId: string
  constructor(toUserName, fromUserName, mediaId) {
    super(toUserName, fromUserName)
    this.mediaId = mediaId
  }
  send() {
    const { toUserName, fromUserName, createTime, mediaId } = this
    return `
        <xml>
        <ToUserName><![CDATA[${toUserName}]]></ToUserName>
        <FromUserName><![CDATA[${fromUserName}]]></FromUserName>
        <CreateTime>${createTime}</CreateTime>
        <MsgType><![CDATA[image]]></MsgType>
        <Image>
        <MediaId><![CDATA[${mediaId}]]></MediaId>
        </Image>
        </xml>
        `
  }
}
