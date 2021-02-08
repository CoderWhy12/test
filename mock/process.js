const Mock = require("mockjs");
const convert = require('xml-js')
// const BpmnModeler = require('bpmn-js/lib/Modeler')
// import BpmnModeler from "bpmn-js/lib/Modeler";
const List = [];
const count = 5;

for (let i = 0; i < count; i++) {
    List.push(
        Mock.mock({
            id: "@increment",
            name: "流程" + "@increment",
            jsonData:{
                "declaration": {
                    "attributes": {
                        "version": "1.0",
                        "encoding": "UTF-8"
                    }
                },
                "elements": [
                    {
                        "type": "element",
                        "name": "bpmn2:definitions",
                        "attributes": {
                            "xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                            "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
                            "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
                            "id": "sample-diagram",
                            "targetNamespace": "http://bpmn.io/schema/bpmn",
                            "xsi:schemaLocation": "http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
                        },
                        "elements": [
                            {
                                "type": "element",
                                "name": "bpmn2:process",
                                "attributes": {
                                    "id": "process1611902224911",
                                    "name": "流程1611902224911"
                                },
                                "elements": [
                                    {
                                        "type": "element",
                                        "name": "bpmn2:startEvent",
                                        "attributes": {
                                            "id": "StartEvent_01ydzqe",
                                            "name": "开始"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "element",
                                "name": "bpmndi:BPMNDiagram",
                                "attributes": {
                                    "id": "BPMNDiagram_1"
                                },
                                "elements": [
                                    {
                                        "type": "element",
                                        "name": "bpmndi:BPMNPlane",
                                        "attributes": {
                                            "id": "BPMNPlane_1",
                                            "bpmnElement": "process1611902224911"
                                        },
                                        "elements": [
                                            {
                                                "type": "element",
                                                "name": "bpmndi:BPMNShape",
                                                "attributes": {
                                                    "id": "StartEvent_01ydzqe_di",
                                                    "bpmnElement": "StartEvent_01ydzqe"
                                                },
                                                "elements": [
                                                    {
                                                        "type": "element",
                                                        "name": "dc:Bounds",
                                                        "attributes": {
                                                            "x": "130",
                                                            "y": "100",
                                                            "width": "40",
                                                            "height": "40"
                                                        }
                                                    },
                                                    {
                                                        "type": "element",
                                                        "name": "bpmndi:BPMNLabel",
                                                        "elements": [
                                                            {
                                                                "type": "element",
                                                                "name": "dc:Bounds",
                                                                "attributes": {
                                                                    "x": "137",
                                                                    "y": "143",
                                                                    "width": "22",
                                                                    "height": "14"
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            nodeList: [],
            status: "@integer(0, 1)",
        })
    );
}

module.exports = [
    {
        url: "/process/list",
        type: "get",
        response: (config) => {
            // const {
            //     query: { page = 1, rows = 10, name, ip, type, deptName, status },
            // } = config;
            // const queryList = List.filter((item) => {
            //     if (name && !item.name.includes(name)) {
            //         return false;
            //     }
            //     if (ip && !item.ip.includes(ip)) {
            //         return false;
            //     }
            //     if (deptName && !deptName.includes(item.deptName)) {
            //         return false;
            //     }
            //     if (type && !type.includes(item.type)) {
            //         return false;
            //     }
            //     if (status && parseFloat(item.status) !== parseFloat(status)) {
            //         return false;
            //     }
            //     return true;
            // });

            //   const pageList = queryList.filter(
            //     (item, index) => index < rows * page && index >= rows * (page - 1)
            //   );

            // console.log({
            //     query: config.query,
            //     queryListLength: queryList.length,
            //     pageListLength: pageList.length,
            // });

            return {
                code:20000,
                data: {
                    data: List,
                    total: List.length,
                },
            };
        },
    },
    {
        url: "/process/setProcess",
        type: "post",
        response: (config) => {
            const {
                body
             } = config;
             const id = body.id
             const index = List.findIndex(item => item.id === id)
             if(index > -1) {
                 List.splice(index,1,body)
             }else {
                 List.push(body)
             }
             return {
                 code:20000,
                 data: {
                     data: List,
                     total: List.length,
                 },
             };
        },
    },
    {
        url:'/process/del',
        type:'post',
        response:(config) => {
            const {body} = config
            const id = body.id
            const index = List.findIndex(item => item.id === id)
            List.splice(index,1)
            return {
                code:20000,
                data:{
                    data:List,
                    total:List.length
                }
            }
        }
    },
    //查询某一状态的下一状态
    {
        url:'/process/getNextStatus',
        type:'get',
        responese:(config) =>{
            // const {query:{id,nodeId} }= config
            // const process = List.find(item => item.id === id)
            // const bpmnModeler = new BpmnModeler()
            // bpmnModeler.importXML(convert.json2xml(process.jsonData))

            // return {
            //     data:bpmnModeler
            // }
        }
    }

];
