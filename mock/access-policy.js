const Mock = require("mockjs");

const List = [];
const count = 100;
const logList = [];
const logCount = 50;
const transTimeString = (val) => {
  const date = new Date(val);
  console.log(date.getTime() / 1000);
  return date.getTime() / 1000;
};
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "@pick(['策略1','策略2','策略3','策略4'])",
      founder: "@cname",
      createTime: "@datetime",
      // dept: "@pick(['研发一组','质量部','综管部'])",
      dept: [
        {
          label: '@pick(["研发一组", "研发二组", "研发三组"])',
        },
      ],
      userGroup: [
        {
          name: '@pick(["用户组1", "用户组2", "用户组3"])',
        },
      ],
      // userGroup: "@pick(['用户组1','用户组2','用户组3'])",
      user: "@cname",
      role: "角色" + "@integer(0, 1)",
      accessResources: "@ctitle",
      whitelist: "@ctitle",
      blacklist: "@ctitle",
      //   'enableTimePeriod|2': "@datetime" + "至" + "@datetime",
      "enableTimePeriod|1-1": ["@dateTime", "@dateTime"],
      priority: "@integer(1, 4)",
      status: "@integer(0, 1)",
      multiFactor: "@pick(['动态口令','短信服务','邮箱验证'])",
      strategy: "@pick(['允许','允许加记录','禁止','禁止加记录'])",
    })
  );
}

for (let i = 0; i < logCount; i++) {
  logList.push(
    Mock.mock({
      id: "",
      operationTime: "@datetime",
      operator: "@cname",
      ip: "@ip",
      operationType: "@pick(['VPN','打印服务','文件共享服务'])",
    })
  );
}

module.exports = [
  {
    url: "/access-policy/list",
    type: "get",
    response: (config) => {
      const {
        query: {
          page = 1,
          rows = 10,
          dept,
          userGroup,
          user,
          accessResources,
          enableTimePeriod,
          priority,
          status,
          multiFactor,
        },
      } = config;
      const queryList = List.filter((item) => {
        if (dept && !item.dept.toString().includes(dept)) {
          return false;
        }
        if (userGroup && !item.userGroup.includes(userGroup)) {
          return false;
        }
        if (user && !user.includes(item.user)) {
          return false;
        }
        if (
          accessResources &&
          !accessResources.includes(item.accessResources)
        ) {
          return false;
        }
        if (
          enableTimePeriod &&
          !(
            transTimeString(enableTimePeriod[0]) >
              transTimeString(item.enableTimePeriod[0]) &&
            transTimeString(enableTimePeriod[1]) <
              transTimeString(item.enableTimePeriod[1])
          )
        ) {
          return false;
        }
        if (priority && parseFloat(item.priority) !== parseFloat(priority)) {
          return false;
        }

        if (status && parseFloat(item.status) !== parseFloat(status)) {
          return false;
        }
        if (multiFactor && !multiFactor.includes(item.multiFactor)) {
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
    url: "/access-policy/log",
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
