const Mock = require("mockjs");

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "@cname",
      ip: "@ip",
      editTime: "@datetime",
      type: "@pick(['登录','退出'])",
    })
  );
}

module.exports = [
  {
    url: "/security-log/list",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 12, name, ip, type },
      } = config;
      const queryList = List.filter((item) => {
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (ip && !item.ip.includes(ip)) {
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
];
