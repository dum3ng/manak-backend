const xml2js = require('xml2js')

const data = `<xml><ToUserName><![CDATA[gh_04314a4f930b]]></ToUserName>
<FromUserName><![CDATA[oGUIP1P56ZIMGl3jfVG5D6DJbKcQ]]></FromUserName>
<CreateTime>1580870346</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[jjjj]]></Content>
<MsgId>22632618365076670</MsgId></xml>`

xml2js.parseString(data, (err, result) => {
  console.log(result)
})
const parser = xml2js.Parser({ explicitArray: false })
parser.parseStringPromise(data).then(res => console.log('res: ', res))
