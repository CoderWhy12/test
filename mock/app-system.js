const Mock = require("mockjs");
const List = [];
const count = 100;
const LogoList = [];
const logoCount = 50;
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      systemName: "系统" + "@integer(1, 8)",
      ExternalNetAddress: "http://zh.tycom.cn:" + "@integer(12345, 19999)",
      internalNetAddress:
        "http://172.20.2." + "@integer(120, 199)" + ":" + "@integer(0, 3000)",
      callbackAddress: "http://172.20.2.123:45/" + "@last",
      type: '@pick(["图库管理", "发布系统", "APP配置","系统管理"])',
      createTime: "@datetime",
      // deptName: '@pick(["研发一组", "研发二组", "综管部","质量部"])',
      deptName: [
        {
          label: '@pick(["研发一组", "研发二组", "研发三组"])',
        },
      ],
      mainConfig: '@pick(["配置1", "配置2", "配置3","配置4"])',
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
      operationType: '@pick(["图库管理", "发布系统", "APP配置","系统管理"])',
    })
  );
}

module.exports = [
  {
    url: "/app-system/getPage",
    type: "get",
    response: (config) => {
      const {
        query: {
          page = 1,
          rows = 10,
          ExternalNetAddress,
          internalNetAddress,
          type,
          systemName,
          deptName,
        },
      } = config;
      const queryList = List.filter((item) => {
        if (systemName && !item.systemName.includes(systemName)) {
          return false;
        }
        if (type && !type.includes(item.type)) {
          return false;
        }
        if (
          ExternalNetAddress &&
          !String(item.ExternalNetAddress).includes(String(ExternalNetAddress))
        ) {
          return false;
        }
        if (
          internalNetAddress &&
          !String(item.internalNetAddress).includes(String(internalNetAddress))
        ) {
          return false;
        }
        if (deptName && !deptName.includes(item.deptName)) {
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
    url: "/app-system/getLogo",
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
