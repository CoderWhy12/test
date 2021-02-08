const Mock = require("mockjs");

const List = [];
const count = 500;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "@cname",
      status: "@integer(0, 1)",
      type: '@pick(["防护墙", "VPN", "图库系统","oAuth","Windows"])',
      resourcesType: '@pick(["网络设备", "应用系统", "接口","计算机"])',
    })
  );
}

module.exports = [
  {
    url: "/resources/list",
    type: "get",
    response: (config) => {
      const {
        query: {
          page = 1,
          rows = 20,
          name,
          deptName,
          status,
          type,
          resourcesType,
        },
      } = config;
      const queryList = List.filter((item) => {
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (deptName && !deptName.includes(item.deptName)) {
          return false;
        }
        if (type && !type.includes(item.type)) {
          return false;
        }
        if (resourcesType && !resourcesType.includes(item.resourcesType)) {
          return false;
        }
        if (status && parseInt(item.status) !== parseInt(status)) {
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
