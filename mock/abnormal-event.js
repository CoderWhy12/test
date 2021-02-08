const Mock = require("mockjs");

const List = [];
const count = 100;
const conditionList = [];
const conditionCount = 100;
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      operateTime: "@datetime",
      operator: "@cname",
      ip: "@ip",
      errorType: "@pick(['登陆失败','不明原因'])",
      errorInfo: "@ctitle",
    })
  );
}

for (let i = 0; i < conditionCount; i++) {
  conditionList.push(
    Mock.mock({
      id: "@increment",
      conditionName: "@ctitle",
      operateTime: "@datetime",
      conditionParam: "@ctitle",
      type: "@pick(['integer','period','time'])",
      operator: "@cname",
      status: "@integer(0, 1)",
    })
  );
}

module.exports = [
  {
    url: "/abnormal-event/list",
    type: "get",
    response: (config) => {
      const {
        query: {
          page = 1,
          rows = 10,
          operator,
          ip,
          errorInfo,
          errorType,
          operateTime,
        },
      } = config;
      const queryList = List.filter((item) => {
        if (operator && !item.operator.toString().includes(operator)) {
          return false;
        }
        if (ip && !item.ip.includes(ip)) {
          return false;
        }
        if (errorInfo && !errorInfo.includes(item.errorInfo)) {
          return false;
        }
        if (errorType && !errorType.includes(item.errorType)) {
          return false;
        }
        if (operateTime && !operateTime.includes(item.operateTime)) {
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
    url: "/abnormal-event/condition",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, operator, conditionName, status },
      } = config;
      const queryList = conditionList.filter((item) => {
        if (operator && !item.operator.toString().includes(operator)) {
          return false;
        }
        if (
          conditionName &&
          !item.conditionName.toString().includes(conditionName)
        ) {
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
