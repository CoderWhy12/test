const Mock = require("mockjs");

const List = [];
const count = 100;

const logList = [];
const logCount = 50;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "@cname",
      nick: "@first",
      code: "@string",
      status: "@integer(0, 1)",
      title: '@pick(["后端开发", "技术经理", "综管主管", "技术总监"])',
      mobile: "@integer(13100000000, 13700000000)",
      createTime: "@datetime",
      // deptName: '@pick(["研发部", "综管部", "IT部"])',
      deptName: [
        {
          label: '@pick(["研发部", "综管部", "IT部"])',
        },
      ],
      // userGroupName: '@pick(["开发组", "测试组", "运维组"])',
      userGroupName: [
        {
          name: '@pick(["开发组", "测试组", "运维组"])',
        },
      ],
      roleName: '@pick(["开发", "测试", "运维"])',
      gender: "@integer(0, 1)",
    })
  );
}

for (let i = 0; i < logCount; i++) {
  logList.push(
    Mock.mock({
      id: "",
      operationTime: "@datetime",
      ip: "@pick(['127.0.0.1','192.168.0.203','172.20.3.100'])",
      operationType: "@pick('登录','退出','自动退出')",
    })
  );
}

const tokens = {
  admin: {
    token: "admin-token",
  },
  editor: {
    token: "editor-token",
  },
};

const users = {
  "admin-token": {
    roles: ["admin"],
    introduction: "I am a super administrator",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "Super Admin",
  },
  "editor-token": {
    roles: ["editor"],
    introduction: "I am an editor",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "Normal Editor",
  },
};

module.exports = [
  // user login
  {
    url: "/vue-element-admin/user/login",
    type: "post",
    response: (config) => {
      const { username } = config.body;
      const token = tokens[username];

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: "Account and password are incorrect.",
        };
      }

      return {
        code: 20000,
        data: token,
      };
    },
  },

  // get user info
  {
    url: "/vue-element-admin/user/info.*",
    type: "get",
    response: (config) => {
      const { token } = config.query;
      const info = users[token];

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: "Login failed, unable to get user details.",
        };
      }

      return {
        code: 20000,
        data: info,
      };
    },
  },

  // user logout
  {
    url: "/vue-element-admin/user/logout",
    type: "post",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/vue-element-admin/user/list",
    type: "get",
    response: (config) => {
      const {
        query: {
          page = 1,
          rows = 10,
          name,
          code,
          deptName,
          status,
          userGroupName,
          roleName,
          mobile,
        },
      } = config;
      const queryList = List.filter((item) => {
        if (name && !item.name.includes(name)) {
          return false;
        }
        if (code && !item.code.includes(code)) {
          return false;
        }
        if (mobile && !String(item.mobile).includes(String(mobile))) {
          return false;
        }
        if (deptName && !deptName.includes(item.deptName)) {
          return false;
        }
        if (userGroupName && !userGroupName.includes(item.userGroupName)) {
          return false;
        }
        if (status && parseInt(item.status) !== parseInt(status)) {
          return false;
        }
        if (roleName && !roleName.includes(item.roleName)) {
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
    url: "/vue-element-admin/user/log",
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
