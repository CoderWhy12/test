import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg';
import { customElements, customConfig, hasLabelElements } from '../utils/utils'
import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500

export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer, modeling) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
        this.modeling = modeling;
    }

    canRender(element) {
        // ignore labels
        return !element.labelTarget;
    }

    drawShape(parentNode, element) {
        console.log(element)
        const type = element.type // 获取到类型
        if (customElements.includes(type)) { // or customConfig[type]
            const { url, attr } = customConfig[type]
            const customIcon = svgCreate('image', {
                ...attr,
                href: url
            })
            element['width'] = attr.width // 这里我是取了巧, 直接修改了元素的宽高
            element['height'] = attr.height
            svgAppend(parentNode, customIcon)
            // 判断是否有name属性来决定是否要渲染出label
            if (!hasLabelElements.includes(type) && element.businessObject.name) {

            }
            const text = svgCreate('text', {
                x: attr.x,
                y: attr.y + attr.height / 2,
                "font-size": "14",
                "fill": "#000"
            })
            // text.innerHTML = element.businessObject.name
            text.innerHTML = '自定义网关'
            // svgAppend(parentNode, text)
            console.log(text)


            // if(!hasLabelElements.includes(type) && element.businessObject.name) {
            //     const text = svgCreate('text',{
            //         x:attr.x,
            //         y:attr.y + attr.height - 50,
            //         'font-size':'14px',
            //         'fill':'#000'
            //     })

            //     text.innerHTML = element.businessObject.name
            //     text = text.aplice(3,0)
            // }
            // this.modeling.resizeShape(element, {
            //     x: element.x,
            //     y: element.y,
            //     width: element['width'] / 2,
            //     height: element['height'] / 2
            // })
            return customIcon
        }
        // else if (type === 'bpmn:TextAnnotation' && element.businessObject.color) {
        //     console.log('我是绿色的')
        //     let color = element.businessObject.color
        //     element.businessObject.di.set('bioc:stroke', color)
        //     const shape = this.bpmnRenderer.drawShape(parentNode, element)
        //     return shape
        // }
        const shape = this.bpmnRenderer.drawShape(parentNode, element)
        return shape
    }

    getShapePath(shape) {
        return this.bpmnRenderer.getShapePath(shape);
    }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer', 'modeling'];