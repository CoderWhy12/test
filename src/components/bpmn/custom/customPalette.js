export default class CustomPalette {
    constructor(bpmnFactory, create, elementFactory, palette, translate) {
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        palette.registerProvider(this);
    }

    getPaletteEntries(element) {
        const {
            bpmnFactory,
            create,
            elementFactory,
            translate
        } = this;


        function createTask() {
            return function (event) {
                const businessObject = bpmnFactory.create('bpmn:ExclusiveGateway');
                businessObject['custom'] = 1
                // businessObject['name'] = 'my-gateway'
                const shape = elementFactory.createShape({
                    type: 'bpmn:ExclusiveGateway',
                    businessObject
                });
                console.log(shape) // 只在拖动或者点击时触发
                create.start(event, shape);
            }
        }

        return {
            'create.self-task': {
                group: 'gateway',
                className: 'icon-custom my-gateway',
                // className: 'bpmn-icon-user-task',
                title: translate('创建一个类型为my-gateway的网关节点'),
                action: {
                    dragstart: createTask(),
                    click: createTask()
                }
            }
        }
    }
}

CustomPalette.$inject = [
    'bpmnFactory',
    'create',
    'elementFactory',
    'palette',
    'translate'
]