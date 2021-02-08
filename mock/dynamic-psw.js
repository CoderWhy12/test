const Mock = require("mockjs");

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      type: "@pick(['计时型','计数型'])",
      id: "@increment",
      desc: "@pick(['test','test1','test2','test3'])",
      owner: "@pick(['用户1','用户2','用户3','用户4'])",
      "validPeriod|1-1": ["@dateTime", "@dateTime"],
      supplier: "@pick(['aa,bb,cc,dd'])",
      mode: "@pick(['模式一','模式二','模式三','模式4'])",
      serialNum: "@increment",
      key: "@increment",
      algorithm: "sha" + "@integer(0, 4)",
      digital: "@integer(6,8)",
      timeInterval: "@increment",
      associatedUser: "用户" + "@integer(0, 4)",
      status: "@integer(0, 1)",
    })
  );
}

module.exports = [
  {
    url: "/dynamic-psw/list",
    type: "get",
    response: (config) => {
      const {
        query: {
          page = 1,
          rows = 10,
          type,
          id,
          desc,
          owner,
          validPeriod,
          supplier,
          mode,
          serialNum,
          key,
          algorithm,
          digital,
          timeInterval,
          associatedUser,
          status,
        },
      } = config;
      const queryList = List.filter((item) => {
        if (type && !type.includes(item.type)) {
          return false;
        }
        if (id && !item.id.toString().includes(id)) {
          return false;
        }
        if (desc && !item.desc.includes(desc)) {
          return false;
        }
        if (owner && !owner.includes(item.owner)) {
          return false;
        }
        if (validPeriod && !validPeriod.includes(item.validPeriod)) {
          return false;
        }
        if (supplier && !supplier.includes(item.supplier)) {
          return false;
        }
        if (mode && !mode.includes(item.mode)) {
          return false;
        }
        if (serialNum && !serialNum.includes(item.serialNum)) {
          return false;
        }
        if (key && !key.includes(item.key)) {
          return false;
        }
        if (algorithm && !algorithm.includes(item.algorithm)) {
          return false;
        }
        if (digital && !digital.includes(item.digital)) {
          return false;
        }
        if (timeInterval && !timeInterval.includes(item.timeInterval)) {
          return false;
        }
        if (associatedUser && !associatedUser.includes(item.associatedUser)) {
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
];
