const Mock = require("mockjs");

const List = [];
const count = 100;
const logList = [];
const logCount = 50;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "计算机" + "@integer(0, 4)",
      ip: "@ip",
      type: "@pick(['Windows','Linux'])",
      createTime: "@datetime",
      // deptName: '@pick(["研发一组", "研发二组","综管部","质量部"])',
      deptName: [
        {
          label: '@pick(["研发一组", "研发二组", "研发三组"])',
        },
      ],
      mainConfig: "@pick(['配置1','配置2','配置3'])",
      status: "@integer(0, 1)",
    })
  );
}

for (let i = 0; i < logCount; i++) {
  logList.push(
    Mock.mock({
      id: "",
      operationTime: "@datetime",
      operator: "@cname",
      ip: "@pick(['127.0.0.1','192.168.0.203','172.20.3.100'])",
      operationType: "@pick('Windows','Linux')",
    })
  );
}

module.exports = [
  {
    url: "/computer/list",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, name, ip, type, deptName, status },
      } = config;
      const queryList = List.filter((item) => {
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (ip && !item.ip.includes(ip)) {
          return false;
        }
        if (deptName && !deptName.includes(item.deptName)) {
          return false;
        }
        if (type && !type.includes(item.type)) {
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
  {
    url: "/computer/log",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, id },
      } = config;
      const queryList = logList.filter((item) => {
        item.id = id;
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
