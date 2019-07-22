  var wechat = require('./wechat_config.js');
  var body_data = require('./bodyData.js'); 
  var non_str_random = require('./non_str_random.js');
  var cryptoMO = require('crypto'); 
  var request = require('request'); 
  var xml2js = require('xml2js');
  var xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true }) ;
  var out_trade_no = Date.parse(new Date());
  var non_str = non_str_random(); 
  
  exports.main = async (event, context) => {
     var payBody = 'fee';
     var str = `appid=${wechat.appid}&body=${payBody}&mch_id=${wechat.mch_id}&nonce_str=${non_str}&notify_url=${wechat.notify_url}&openid=${event.openid}&out_trade_no=${out_trade_no}&spbill_create_ip=${wechat.ip}&total_fee=${event.total_fee}&trade_type=JSAPI&key=${wechat.key}`;
      var sign = cryptoMO.createHash('md5').update(str).digest('hex');
      var temp_body_data = body_data(wechat, payBody, non_str, event.openid, out_trade_no, event.total_fee, sign);         return new Promise((resolve, reject) => request({ url: wechat.url, method: 'POST', body: temp_body_data }, (err, res, body) => { xmlParser.parseString(body, (err, res) => { var prepay_id = res.xml.prepay_id; var str = `appId=${wechat.appid}&nonceStr=${non_str}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${out_trade_no}&key=${wechat.key}`; 
      var paySign = cryptoMO.createHash('md5').update(str).digest('hex');
      return resolve({ success: true, data: { timeStamp: out_trade_no.toString(), nonceStr: non_str, package: `prepay_id=${prepay_id}`, paySign: paySign, outTradeNo: out_trade_no } }); }) })) }

