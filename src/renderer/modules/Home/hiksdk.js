const crypto = require("crypto");
const https = require("https");

const ERR_CODE = {
  "0x02401000": "APPKey为空", // 	请求中填写正确的APP Key
  "0x02401001": "APPKey对应的合作方不存在", // 	请求中填写正确的APP Key
  "0x02401002": "签名为空", // 	请求中填写正确的签名信息
  "0x02401003": "签名不正确", // 	请求中填写正确的签名信息
  "0x02401004": "API令牌的身份验证失败", // 	检查token是否填写正确
  "0x02401005": "API令牌为空", // 	检查token是否填写正确
  "0x02401006": "API令牌异常", // 	检查token是否填写正确
  "0x02401007": "API令牌过期", // 	重新获取token
  "0x02401008": "API接口未授权", // 	向API接口管理员申请接口访问权限
  "0x02401009": "权限验证异常", // 	检查API网关服务是否异常
  "0x0240100a": "参数转换异常，具体错误见异常信息", // 	检查API接口参数是否正确,检查合作方参数是否都已配置
  "0x0240100b": "API接口调用次数受限", // 	向API接口管理员申请增加接口访问次数
  "0x0240100c": "接口调用统计异常", // 	重启网关服务
  "0x02400004": "服务调用异常", // 	检查服务提供方是否正常
  "0x0240101b": "合作方IP受限", // 	在合作方允许的IP段内调用
  "0x0240101c": "合作方MAC受限", // 	使用合作方允许的MAC调用
  "0x0240101d": "合作方IP、MAC受限", // 	在合作方允许的IP段、MAC白名单内进行调用
  "0x02401021": "解析请求JSON数据异常", // 	检查请求的数据是否为JSON数据
  "0x02401022": "解析返回JSON数据异常", // 	检查接口返回数据是否为JSON数据
  "0x02401023": "不支持的请求编码字符集", // 	检查请求方的字符编码集是否合法
  "0x02401023": "不支持的请求编码字符集", // 	检查请求方的字符编码集是否合法
  "0x00072001": "必填参数为空", // 	请求中填写必要的参数
  "0x00072002": "参数范围不正确", // 	请求中参数范围填写不正确
  "0x00072003": "参数格式不正确", // 	请求中参数格式填写不正确
  "0x00072004": "返回报文过长", // 	请求中设置合适的分页大小
  "0x00072005": "参数不存在", // 	请求中改写为支持的参数
  "0x00072006": "参数内容过长", // 	请求中将参数内容长度缩小
  "0x00052101": "服务性能已达上限", // 	请稍后重试
  "0x00052102": "服务出错", // 	请稍后重试
  "0x00052103": "服务响应超时", // 	请稍后重试
  "0x00052104": "服务不可用", // 	待服务修复后重试
  "0x00072201": "资源访问未授权", // 	向资源管理员申请资源访问权限
  "0x00072202": "资源不存在", // 	请求中填写正确的资源编号
  "0x00072203": "license数量受限", // 	向管理员核对license信息
  "0x00072204": "license未提供该功能", // 	向管理员核对license信息
  "0x00052301": "其他未知的错误",
};

const HIK_AK = "29666671";
const HIK_SK = "XO0wCAYGi4KV70ybjznx";

function signature(httpOpts) {
  httpOpts.headers["X-Ca-Key"] = HIK_AK;
  httpOpts.headers["X-Ca-Signature-Headers"] = "x-ca-key";

  var str = "";
  str += `${httpOpts.method}\n`;
  str += `${httpOpts.headers["Accept"]}\n`;
  str += `${httpOpts.headers["Content-MD5"]}\n`;
  str += `${httpOpts.headers["Content-Type"]}\n`;
  str += `${httpOpts.headers["Date"]}\n`;
  str += `x-ca-key:${httpOpts.headers["X-Ca-Key"]}\n`;
  str += `${httpOpts.path}`;
  console.log("[before sign]");
  console.log(str);
  var s = crypto
    .createHmac("sha256", HIK_SK)
    .update(str, "utf8")
    .digest("base64");
  console.log("[after sign]");
  console.log(s);
  httpOpts.headers["X-Ca-Signature"] = s;
}

function $http(options) {
  var httpOpts = {
    hostname: options.host,
    port: options.port || 443, //443
    path: options.url,
    method: (options.type || "POST").toUpperCase(),
    rejectUnauthorized: false,
  };
  var bodyData = JSON.stringify(options.data);
  //degist body
  var contentMd5 = crypto
    .createHash("md5")
    .update(bodyData || "")
    .digest("base64");
  //headers
  httpOpts.headers = {
    "User-Agent": "PostmanRuntime/7.25.0",
    Accept: "*/*",
    "Content-MD5": contentMd5,
    "Content-Type": "application/json",
    Date: Date.now(),
  };
  //sign
  signature(httpOpts);

  return new Promise((resolve, reject) => {
    var req = https.request(httpOpts, function(res) {
      res.setEncoding("utf-8");
      var buff = "";
      res.on("data", function(chunk) {
        buff += chunk;
      });
      res.on("end", function(chunk) {
        console.log("end:" + buff);
        try {
          var data = JSON.parse(buff);
          if (data && data.code == "0") {
            resolve(data.data);
          } else if (data) {
            $tip(`${data.code}:${ERR_CODE[data.code] || "未知错误"}`);
            reject(`${data.code}:${ERR_CODE[data.code] || "未知错误"}`);
          } else {
            $tip(`未知错误`);
            reject("未知错误");
          }
        } catch (e) {
          resolve(buff);
        }
      });
    });
    req.setTimeout(5 * 1000);
    if (bodyData) {
      req.write(bodyData);
    }
    req.on("error", function(e) {
      reject(e);
    });
    req.write("");
    req.end();
    console.log(3);
  });
}

var http = require("http");

export default {
  loadAllRegions() {
    return $http({
      host: "www.baidu.com",
      url: "/artemis/api/resource/v1/regions",
      data: {
        pageNo: 1,
        pageSize: 1000,
      },
    }).then((res) => {
      return (
        (res && res.list) || [
          {
            indexCode: "root000000",
            name: "根节点",
            parentIndexCode: "null",
            treeCode: "0",
          },
          {
            indexCode: "root000001",
            name: "仓库",
            parentIndexCode: "root000000",
            treeCode: "1",
          },
          {
            indexCode: "root000002",
            name: "楼道",
            parentIndexCode: "root000000",
            treeCode: "1",
          },
        ]
      );
    });
  },
  loadAllCameras() {
    return $http({
      host: "www.baidu.com",
      url: "/artemis/api/resource/v1/cameras",
      data: {
        pageNo: 1,
        pageSize: 1000,
      },
    }).then((res) => {
      return (
        (res && res.list) || [
          {
            altitude: null,
            cameraIndexCode: "eddf8458f74d42e9bf4ecfc752dba146",
            cameraName: "3层吉米后厨入口",
            cameraType: 0,
            cameraTypeName: "枪机",
            capabilitySet:
              "io,event_io,event_ias,event_rule,event_heat,record,net,event_face,vss,ptz,status,maintenance,event_device",
            capabilitySetName: null,
            intelligentSet: null,
            intelligentSetName: null,
            channelNo: "33",
            channelType: "digital",
            channelTypeName: "数字通道",
            createTime: "2018-09-15T11:14:27.812+08:00",
            encodeDevIndexCode: "1d3d5c26e6174cf1aa452f57cac91879",
            encodeDevResourceType: null,
            encodeDevResourceTypeName: null,
            gbIndexCode: null,
            installLocation: null,
            keyBoardCode: null,
            latitude: null,
            longitude: null,
            pixel: null,
            ptz: null,
            ptzName: null,
            ptzController: null,
            ptzControllerName: null,
            recordLocation: null,
            recordLocationName: null,
            regionIndexCode: "root000001",
            status: null,
            statusName: null,
            transType: 1,
            transTypeName: "TCP",
            treatyType: null,
            treatyTypeName: null,
            viewshed: null,
            updateTime: "2018-09-15T11:19:48.973+08:00",
          },
          {
            altitude: null,
            cameraIndexCode: "e123123213",
            cameraName: "3层吉米后厨入口222",
            cameraType: 0,
            cameraTypeName: "枪机",
            capabilitySet:
              "io,event_io,event_ias,event_rule,event_heat,record,net,event_face,vss,ptz,status,maintenance,event_device",
            capabilitySetName: null,
            intelligentSet: null,
            intelligentSetName: null,
            channelNo: "33",
            channelType: "digital",
            channelTypeName: "数字通道",
            createTime: "2018-09-15T11:14:27.812+08:00",
            encodeDevIndexCode: "1d3d5c26e6174cf1aa452f57cac91879",
            encodeDevResourceType: null,
            encodeDevResourceTypeName: null,
            gbIndexCode: null,
            installLocation: null,
            keyBoardCode: null,
            latitude: null,
            longitude: null,
            pixel: null,
            ptz: null,
            ptzName: null,
            ptzController: null,
            ptzControllerName: null,
            recordLocation: null,
            recordLocationName: null,
            regionIndexCode: "root000002",
            status: null,
            statusName: null,
            transType: 1,
            transTypeName: "TCP",
            treatyType: null,
            treatyTypeName: null,
            viewshed: null,
            updateTime: "2018-09-15T11:19:48.973+08:00",
          },
        ]
      );
    });
  },
  getStreamURL(cameraIndexCode) {
    return $http({
      host: "www.baidu.com",
      url: "/api/video/v1/cameras/previewURLs",
      data: {
        cameraIndexCode: cameraIndexCode,
        protocol: "rtmp",
      },
    }).then(res=>{
      return res.url;
    });
  },
};

// console.log(
//   signature({
//     method: "POST",
//     path: "/artemis/api/resource/v1/regions/root",
//     headers: {
//       Accept: "*/*",
//       "Content-MD5": "6YQJqs0FURlvr8KC6U0oiw==",
//       "Content-Type": "application/json",
//       Date: "1592818843594",
//     },
//   })
// );

// $http({
//	host : "",
//	port : "",
// type : "POST",
//	url : "/api/resource/v1/regions/root"
//   data: {
//     a: "1",
//     b: "2",
//   },
// })
//   .then((res) => {})
//   .catch((er) => {
//     console.error(er);
//   });
