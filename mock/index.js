const Mock = require("mockjs");
const { param2Obj } = require("./utils");

const user = require("./user");
const role = require("./role");
const article = require("./article");
const search = require("./remote-search");
const networkService = require("./network-service");
const appSystem = require("./app-system");
const netEquip = require("./net-equip");
const computer = require("./computer");
const roleManage = require("./role-management");
const dynamicPsw = require("./dynamic-psw");
const securityPolicy = require("./security-policy");
const smsService = require("./sms-service");
const userGroup = require("./user-group");
const mailService = require("./mail-service");
const accessPolicy = require("./access-policy");
const sysParam = require("./sys-param");
const abnormalEvent = require("./abnormal-event");
const securityLog = require("./security-log");
const resources = require("./resources");
const treeContainer = require("./tree-container");
const process = require('./process')
const mocks = [
  ...user,
  ...role,
  ...article,
  ...search,
  ...networkService,
  ...netEquip,
  ...appSystem,
  ...computer,
  ...roleManage,
  ...dynamicPsw,
  ...securityPolicy,
  ...smsService,
  ...userGroup,
  ...mailService,
  ...accessPolicy,
  ...sysParam,
  ...abnormalEvent,
  ...securityLog,
  ...resources,
  ...treeContainer,
  ...process
];

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false;

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType;
      }
    }
    this.proxy_send(...arguments);
  };

  function XHR2ExpressReqWrap(respond) {
    return function (options) {
      let result = null;
      if (respond instanceof Function) {
        const { body, type, url } = options;
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url),
        });
      } else {
        result = respond;
      }
      return Mock.mock(result);
    };
  }

  for (const i of mocks) {
    Mock.mock(
      new RegExp(i.url),
      i.type || "get",
      XHR2ExpressReqWrap(i.response)
    );
  }
}

module.exports = {
  mocks,
  mockXHR,
};
