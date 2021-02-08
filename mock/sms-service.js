const Mock = require("mockjs");

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      appKey: "@string(27)",
      voiceMessage: "@integer(0, 1)",
      template:
        "您的验证码为" + "@natural(100000, 999999)" + "有效期十分钟 [珠海腾云]",
      status: "@integer(0, 1)",
    })
  );
}
module.exports = [
  {
    url: "/sms-service/list",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, appKey, voiceMessage },
      } = config;
      const queryList = List.filter((item) => {
        if (appKey && !item.appKey.includes(appKey)) {
          return false;
        }
        if (
          voiceMessage &&
          parseFloat(item.voiceMessage) !== parseFloat(voiceMessage)
        ) {
          return false;
        }
        return true;
      });

      const pageList = queryList.filter(
        (item, index) => index < rows * page && index >= rows * (page - 1)
      );

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
