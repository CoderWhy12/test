const Mock = require('mockjs')

const list = []
const count = 6

for (let i = 0; i < count; i++) {
    list.push(Mock.mock({
        id: '@increment',
        name: Mock.Random.ctitle(3,6),
        createtime:+Mock.Random.date('T'),
        number:Mock.Random.natural(0,10000)
    }))
}

module.exports =  [
    {
        url: '/style_class/list',
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