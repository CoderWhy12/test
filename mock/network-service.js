const Mock = require("mockjs");
const List = [];
const count = 100;
const LogoList = [];
const logoCount = 50;
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "服务" + "@integer(0, 4)",
      ipAddress: '@pick(["127.0.0.1", "192.168.3.31", "192.168.3.63"])',
      type: '@pick(["文件共享服务", "打印服务", "VPN"])',
      createTime: "@datetime",
      mainConfig: '@pick(["配置1", "配置2", "配置3"])',
      // deptName: '@pick(["研发一组", "研发二组", "综管部","质量部"])',
      deptName: [
        {
          label: '@pick(["研一", "研二", "研三","测试部","综管部"])',
        },
      ],
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
    url: "/network-service/getPage",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, ipAddress, type, name, deptName, status },
      } = config;
      const queryList = List.filter((item) => {
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (type && !type.includes(item.type)) {
          return false;
        }
        if (ipAddress && !String(item.ipAddress).includes(String(ipAddress))) {
          return false;
        }
        if (deptName && !deptName.includes(item.deptName)) {
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
  {
    url: "/network-service/getLogo",
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
