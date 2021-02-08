const Mock = require("mockjs");

const List = [];
const count = 100;
const LogoList = [];
const logoCount = 50;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "@cname",
      ip: "@ip",
      type: "@integer(0, 1)",
      model: "@integer(1, 2, 3, 4)",
      createTime: "@datetime",
      // deptName: '@pick(["研发一组", "研发二组", "研发三组"])',
      deptName: [
        {
          label: '@pick(["研一", "研二", "研三","测试部","综管部"])',
        },
      ],
      authenticationMode: '@pick(["LDP", "TEST"])',
      manageURL: "@url",
      networkInterface: '@pick(["TEST", "TEST2"])',
      position: "@province",
      status: "@integer(0, 1)",
    })
  );
}
for (let i = 0; i < logoCount; i++) {
  LogoList.push(
    Mock.mock({
      id: "",
      operationTime: "@datetime",
      operator: "@cname",
      ipAddress: '@pick(["127.0.0.1", "192.168.3.31", "192.168.3.63"])',
      operationType: '@pick(["文件共享服务", "打印服务", "VPN"])',
    })
  );
}

module.exports = [
  {
    url: "/net-equip/list",
    type: "get",
    response: (config) => {
      const {
        query: {
          page = 1,
          rows = 10,
          name,
          ip,
          position,
          manageURL,
          deptName,
          authenticationMode,
          type,
          model,
        },
      } = config;
      const queryList = List.filter((item) => {
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (ip && !item.ip.includes(ip)) {
          return false;
        }
        if (position && !item.position.includes(position)) {
          return false;
        }

        if (deptName && !deptName.includes(item.deptName)) {
          return false;
        }
        if (manageURL && !manageURL.includes(item.manageURL)) {
          return false;
        }
        if (
          authenticationMode &&
          !authenticationMode.includes(item.authenticationMode)
        ) {
          return false;
        }
        if (type && !type.includes(item.type)) {
          return false;
        }
        if (model && !model.includes(item.model)) {
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
    url: "/net-equip/getLogo",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, id },
      } = config;
      const queryList = LogoList.filter((item) => {
        item.id = id;
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
