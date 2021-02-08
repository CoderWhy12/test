const Mock = require("mockjs");
const List = [];
const count = 100;

const RestoreList = [];
const restoreCount = 50;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      // name    userNum   creator  createTime  note
      sysParamCode: "SYS_PARAM" + "@increment",
      name: "参数" + "@increment",
      value: '@pick(["1", "2020-12-29", "198.99","/local/user/admin"])',
      type: '@pick(["整形", "日期", "浮点型","字符串"])',
      modifier: "@cname",
      modifyTime: "@datetime",
      note: "@csentence(3, 10)",
    })
  );
}

for (let i = 0; i < restoreCount; i++) {
  RestoreList.push(
    Mock.mock({
      id: "@increment",
      name: "@first",
      backupTime: "@datetime",
    })
  );
}
module.exports = [
  {
    url: "/sys-param/getPage",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, sysParamCode, name, type },
      } = config;
      const queryList = List.filter((item) => {
        if (sysParamCode && !item.sysParamCode.includes(sysParamCode)) {
          return false;
        }
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (type && !type.includes(item.type)) {
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
  {
    url: "/sys-param/getRestorePage",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10 },
      } = config;
      const queryList = RestoreList.filter((item) => {
        // if (sysParamCode && !item.sysParamCode.includes(sysParamCode)) {
        //   return false;
        // }
        // if (name && !item.name.includes(name)) {
        //   return false;
        // }
        // if (type && !type.includes(item.type)) {
        //   return false;
        // }
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
