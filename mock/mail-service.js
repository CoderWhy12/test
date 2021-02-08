const Mock = require("mockjs");

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "@ctitle",
      mailPsw: "@increment",
      acount: "@pick(['test','code2','code3','code4'])",
      popAddress: "@url",
      imapAddress: "@email",
      smtpAddress: "@email",
      pop3Port: "@natural(1000, 9999)",
      pop3SSLPort: "@natural(1000, 9999)",
      imapPort: "@natural(1000, 9999)",
      imapSSLPort: "@natural(1000, 9999)",
      smptPort: "@natural(1000, 9999)",
      smptSSLPort: "@natural(1000, 9999)",
      smptSendName: "@email",
      smptReplyAcount: "@email",
      smptCopy: "@email",
      status: "@integer(0, 1)",
    })
  );
}

module.exports = [
  {
    url: "/mail-service/list",
    type: "get",
    response: (config) => {
      const {
        query: {
          page = 1,
          rows = 10,
          name,
          acount,
          status,
          imapAddress,
          smtpAddress,
          popAddress,
        },
      } = config;
      const queryList = List.filter((item) => {
        if (name && !name.includes(item.name)) {
          return false;
        }
        if (acount && !item.acount.toString().includes(acount)) {
          return false;
        }
        if (imapAddress && !item.imapAddress.includes(imapAddress)) {
          return false;
        }
        if (smtpAddress && !smtpAddress.includes(item.smtpAddress)) {
          return false;
        }
        if (popAddress && !popAddress.includes(item.popAddress)) {
          return false;
        }
        if (status && parseFloat(item.status) !== parseFloat(status)) {
          return false;
        }
        return true;
      });

      const pageList = queryList.filter(
        (item, index) => index < rows * page && index >= rows * (page - 1)
      );

      console.log({
        query: config.query,
        queryListLength: queryList.length,
        pageListLength: pageList.length,
      });

      return {
        code: 20000,
        data: {
          data: pageList,
          total: queryList.length,
        },
      };
    },
  },
];
