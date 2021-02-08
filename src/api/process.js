import request from "@/utils/request";

//获取流程列表
export function getProcessList(query) {
    return request({
        url: "/process/list",
        method: "get",
        params: query,
    });
}


//增加/修改流程
export function setProcess(query) {
    return request({
        url: "/process/setProcess",
        method: "post",
        data:query
    });
}

//删除流程
export function delProcess(id) {
    return request({
        url: "/process/delProcess",
        method: "post",
        data:id
    });
}


//通过id获取某一个流程

export function getNextStatus(query) {
    return request({
        url: "/process/getNextStatus",
        method: "get",
        params:query
    });
}


