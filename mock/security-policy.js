const Mock = require("mockjs");
const WhiteList = [];
const WhiteListCount = 100;

const BlackList = [];
const BlackListCount = 100;

const PwdList = [];
const PwdListCount = 100;

const getEndIp = function (ip) {
  const arr = ip.split(".");
  arr[3] = parseInt(arr[3]) + 15;
  return arr.join(".");
};

for (let i = 0; i < WhiteListCount; i++) {
  WhiteList.push(
    Mock.mock({
      //name ipAddress ipArea creator  createTime status
      id: "@increment",
      name: "@word(3, 5)",
      ipAddress: "@ip()",
      ipArea: {
        ipStart: "@ip()",
        ipEnd: "",
      },
      creator: "@cname",
      createTime: "@datetime",
      status: "@integer(0, 1)",
    })
  );
}
WhiteList.forEach((item) => {
  item.ipArea.ipEnd = getEndIp(item.ipArea.ipStart);
});

for (let i = 0; i < BlackListCount; i++) {
  BlackList.push(
    Mock.mock({
      //name ipAddress ipArea creator  createTime status
      id: "@increment",
      name: "@word(3, 5)",
      ipAddress: "@ip()",
      ipArea: {
        ipStart: "@ip()",
        ipEnd: "",
      },
      creator: "@cname",
      createTime: "@datetime",
      status: "@integer(0, 1)",
    })
  );
}
BlackList.forEach((item) => {
  item.ipArea.ipEnd = getEndIp(item.ipArea.ipStart);
});

for (let i = 0; i < PwdListCount; i++) {
  PwdList.push(
    Mock.mock({
      //name policy   creator  createTime status
      id: "@increment",
      name: "@word(3, 5)",
      policy: {
        constructor: "EXNode",
        link: "and",
        expression: [
          {
            prop: "pwdLength",
            operator: ">",
            value: 8,
            constructor: "ENNode",
          },
          {
            prop: "pwdNeed",
            operator: "contain",
            value: "case",
            constructor: "ENNode",
          },
          {
            constructor: "EXNode",
            link: "or",
            expression: [
              {
                prop: "pwdLength",
                operator: "=",
                value: 16,
                constructor: "ENNode",
              },
              {
                prop: "pwdNeed",
                operator: "not contain",
                value: "specialCase",
                constructor: "ENNode",
              },
            ],
          },
        ],
      },
      creator: "@cname",
      createTime: "@datetime",
      status: "@integer(0, 1)",
    })
  );
}

module.exports = [
  {
    url: "/security-policy/whitelist/getPage",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, name, ipAddress, ipStart, ipEnd },
      } = config;
      const queryList = WhiteList.filter((item) => {
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (ipAddress && !item.ipAddress.includes(ipAddress)) {
          return false;
        }
        if (ipStart && !item.ipArea.ipStart.includes(ipStart)) {
          return false;
        }
        if (ipEnd && !item.ipArea.ipEnd.includes(ipEnd)) {
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
    url: "/security-policy/blacklist/getPage",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, name, ipAddress, ipStart, ipEnd },
      } = config;
      const queryList = BlackList.filter((item) => {
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (ipAddress && !item.ipAddress.includes(ipAddress)) {
          return false;
        }
        if (ipStart && !item.ipArea.ipStart.includes(ipStart)) {
          return false;
        }
        if (ipEnd && !item.ipArea.ipEnd.includes(ipEnd)) {
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
    url: "/security-policy/pwd-policy/getPage",
    type: "get",
    response: (config) => {
      const {
        query: { page = 1, rows = 10, name, status },
      } = config;
      const queryList = PwdList.filter((item) => {
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (
          status !== undefined &&
          status !== null &&
          item.status !== parseInt(status)
        ) {
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
