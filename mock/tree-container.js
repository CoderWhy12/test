const data = [
  {
    defaultExpandAll: true,
    nodeKey: "id",
    data: [
      {
        id: 1,
        code: "tycom",
        label: "腾云珠海公司",
        status: 1,
        resCount: 10,
        userCount: 10,
        children: [
          {
            id: 2,
            label: "开发部",
            code: "dev",
            status: 1,
            userCount: 3,
            resCount: 4,
            children: [
              {
                id: 3,
                label: "研一",
                status: 1,
                resCount: 2,
                userCount: 1,
                code: "dev1",
              },
              {
                id: 4,
                label: "研二",
                status: 1,
                resCount: 5,
                userCount: 2,
                code: "dev2",
              },
            ],
          },
          {
            id: 5,
            label: "测试部",
            status: 1,
            resCount: 2,
            userCount: 4,
            code: "test",
          },
          {
            id: 6,
            label: "综管部",
            status: 0,
            resCount: 6,
            userCount: 1,
            code: "add",
          },
        ],
      },
    ],
  },
];

module.exports = [
  {
    url: "/tree/container",
    type: "get",
    response: () => {
      return {
        code: 20000,
        data: data,
      };
    },
  },
];
