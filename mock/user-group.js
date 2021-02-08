const Mock = require("mockjs");

const List = [];
const count = 5;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: '@pick(["开发组", "测试组", "运维组"])',
      userGroupCode: "@string",
      status: "@integer(0, 1)",
      checked: false,
      "items|10": [
        {
          name: '@pick(["开发", "测试", "运维"])',
          userCode: "@string",
          status: "@integer(0, 1)",
          title: '@pick(["后端开发", "技术经理", "综管主管", "技术总监"])',
          roleSource: '@pick(["来源1", "来源12", "来源123", "来源1234"])',
          roleName: '@pick(["角色1", "角色12", "角色123", "角色1234"])',
        },
      ],
    })
  );
}
module.exports = [
  {
    url: "/user-group/select-list",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10 },
      } = config;
      const queryList = List.filter((item) => {
        // if (name && !item.name.includes(name)) { return false }
        // if (code && !item.code.includes(code)) { return false }
        // if (mobile && !String(item.mobile).includes(String(mobile))) { return false }
        // if (deptName && !deptName.includes(item.deptName)) { return false }
        // if (userGroupName && !userGroupName.includes(item.userGroupName)) { return false }
        // if (status && parseInt(item.status) !== parseInt(status)) { return false }
        // if (roleName && !roleName.includes(item.roleName)) { return false }
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
