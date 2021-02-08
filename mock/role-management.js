const Mock = require("mockjs");
const List = [];
const count = 100;
const StrategyList = [];
const strategyCount = 50;
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      // name    userNum   creator  createTime  note
      name:
        '@pick(["管理员", "普通用户1", "普通用户2","只读用户1","只读用户2"])',
      userNum: "@integer(1, 10)",
      creator: "@cname",
      createTime: "@datetime",
      note: "@csentence(3, 10)",
      source: "来源" + "@integer(1, 5)",
      "applySubDept|1": true,
    })
  );
}
for (let i = 0; i < strategyCount; i++) {
  StrategyList.push(
    Mock.mock({
      id: "@increment",
      name: "策略" + "@integer(1, 10)",
    })
  );
}

module.exports = [
  {
    url: "/role-management/getPage",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, name },
      } = config;
      const queryList = List.filter((item) => {
        if (name && !item.name.includes(name)) {
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
    url: "/role-management/getStrategy",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, name },
      } = config;
      const queryList = StrategyList.filter((item) => {
        if (name && !item.name.includes(name)) {
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
