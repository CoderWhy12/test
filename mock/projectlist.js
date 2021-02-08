const Mock = require('mockjs')

const list = []
const count = 10

for (let i = 0; i < count; i++) {
    list.push(Mock.mock({
        id: '@increment',
        name: Mock.Random.ctitle(3,6),
        createtime:+Mock.Random.date('T')
    }))
}

module.exports =  [
    {
        url: '/project/list',
        type: 'get',
        response: _ => {
            for (const project of list) {
                return {
                    code: 200,
                    data: list
                }
            }
        }
    }
]