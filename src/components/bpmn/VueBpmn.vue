<template>
  <div class="container">
    <div class="bpmn-viewer">
      <vue-header
        class="bpmn-viewer-header"
        :processData="initData"
        :modeler="bpmnModeler"
        @restart="restart"
        @handleExportSvg="handleExportSvg"
        @handleExportBpmn="handleExportBpmn"
        @processSave="processSave"
      ></vue-header>
      <div class="bpmn-viewer-container bpmn-color">
        <div class="bpmn-viewer-content" ref="bpmnViewer"></div>
      </div>
    </div>
    <bpmn-panel
      v-if="bpmnModeler"
      :modeler="bpmnModeler"
      :process="initData"
    ></bpmn-panel>
  </div>
</template>

<script>
import templateXml from "./data/template";
// import BpmnModeler from "jeeplus-bpmn/lib/Modeler";
import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import customTranslate from "./data/translate/customTranslate";
import VueHeader from "./Header";
import BpmnPanel from "./panel/index";
import activitiModele from "./data/activiti.json";
import flowableModdle from "./data/flowable.json";
import "./assets/css/vue-bmpn.css";
import "./assets/css/font-awesome.min.css";
import { getMailServiceList } from "../../api/mail-service";

//自定义
import customModule from "./custom";

const convert = require("xml-js");
export default {
  name: "VueBpmn",
  data() {
    return {
      bpmnModeler: null,
      initTemplate: "",
      initData: {},
      jsonData: [],
    };
  },
  watch: {
    initData: {
      handler(val) {
        console.log(val);
      },
      deep: true,
    },
    bpmnModeler: {
      handler() {
        // console.log(val);
      },
      deep: true,
    },
    initTemplate: {
      handler(val) {
        // console.log(val);
      },
      deep: true,
    },
  },
  props: {
    product: String,
    //弹窗模式
    mode: {
      type: String,
      default: "create",
    },
    //流程数据
    processData: {
      type: Object,
    },
  },
  components: {
    VueHeader,
    BpmnPanel,
  },
  async mounted() {
    // const res = await getMailServiceList();
    // console.log(res);
    
    let processId = new Date().getTime();
    // this.initTemplate = templateXml.initTemplate(processId);
    // console.log(this.initTemplate)
    if (this.mode === "create") {
      this.initTemplate = templateXml.xml;
      this.initData = {
        key: "process" + processId,
        name: "流程" + processId,
        xml: this.initTemplate,
      };
    } else {
      // console.log(JSON.parse(this.processData.jsonData))
      const processXml = convert.json2xml(this.processData.jsonData);
      this.initTemplate = processXml;
      this.initData = {
        key: this.processData.id,
        name: this.processData.name,
        xml: processXml,
      };
    }

    this.init();

    // this.jsonData = JSON.parse(convert.xml2json(this.initTemplate), {
    //   alwaysChildren: false,
    //   compact: true,
    //   spaces: 4,
    // });

    // console.log('初始化的xml',this.jsonData);

    // console.log(this.jsonData.elements[0].elements[0].elements)
  },
  methods: {
    init() {
      // 支持activiti和flowable
      let _moddleExtensions = this.getModdleExtensions();
      // 获取画布 element
      this.canvas = this.$refs.bpmnViewer;
      // 创建Bpmn对象
      this.bpmnModeler = new BpmnModeler({
        container: this.canvas,
        additionalModules: [
          {
            translate: ["value", customTranslate],
          },
          customModule,
          propertiesProviderModule,
        ],
        moddleExtensions: _moddleExtensions,
      });

      /*let _tag = document.getElementsByClassName("djs-overlay-container")[0];
        if (_tag) {
          _tag.style.width = "100%";
          _tag.style.height = "100%";
        }*/

      // 初始化建模器内容
      this.initDiagram(this.initTemplate);
    },
    async initDiagram(xml) {
      await this.bpmnModeler.importXML(xml, (err) => {
        if (err) {
          // this.$Message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
        }
        let _tag = document.getElementsByTagName("svg")[0];
        if (_tag) {
          _tag.style.width = "100%";
          _tag.style.height = "700px";
        }
      });

      setTimeout(() => {
        // console.log(
        //   this.bpmnModeler.getDefinitions().rootElements[0].flowElements[0]
        //     .outgoing[0].targetRef.name
        // );

        console.log(this.bpmnModeler.getDefinitions());
        //获取流程对象
        let processObj = {};
        const processIndex = this.bpmnModeler
          .getDefinitions()
          .rootElements.findIndex((item) => item.$type === "bpmn:Process");
        if (processIndex > -1) {
          processObj = this.bpmnModeler.getDefinitions().rootElements[
            processIndex
          ];
        }
        //流程节点数组(过滤掉箭头节点)
        const nodeList = [];
        if (processObj.flowElements.length) {
          nodeList.push(
            ...processObj.flowElements.filter(
              (item) => item.$type !== "bpmn:SequenceFlow"
            )
          );
        }

        // console.log(processList.length)
      });
      // console.log(this.bpmnModeler.get("elementRegistry"));
    },
    handleExportBpmn() {
      const _this = this;
      this.bpmnModeler.saveXML(function(err, xml) {
        if (err) {
          console.error(err);
        }
        let { filename, href } = _this.setEncoded("BPMN", xml);
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      });
    },
    handleExportSvg() {
      const _this = this;
      this.bpmnModeler.saveSVG(function(err, svg) {
        if (err) {
          console.error(err);
        }
        let { filename, href } = _this.setEncoded("SVG", svg);
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename;
          a.href = href;
          a.click();
          URL.revokeObjectURL(a.href);
        }
      });
    },
    setEncoded(type, data) {
      const encodedData = encodeURIComponent(data);
      if (data) {
        if (type === "XML") {
          return {
            filename: "diagram.bpmn20.xml",
            href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
            data: data,
          };
        }
        if (type === "BPMN") {
          return {
            filename: "diagram.bpmn",
            href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
            data: data,
          };
        }
        if (type === "SVG") {
          this.initData.svg = data;
          return {
            filename: "diagram.svg",
            href: "data:application/text/xml;charset=UTF-8," + encodedData,
            data: data,
          };
        }
      }
    },
    processSave(data) {
      let initData = this.initData;
      data.procId = initData.key;
      data.name = initData.name;
      this.$emit("processSave", data);
    },
    restart() {
      let processId = new Date().getTime();
      this.initTemplate = templateXml.initTemplate(processId);
      this.initData = {
        key: "process" + processId,
        name: "流程" + processId,
        xml: this.initTemplate,
      };
      this.initDiagram(this.initTemplate);
    },
    getModdleExtensions() {
      let moddleExtensions = {};
      if (this.product == "flowable") {
        moddleExtensions = {
          flowable: flowableModdle,
        };
      }
      if (this.product == "activiti") {
        moddleExtensions = {
          activiti: activitiModele,
        };
      }
      return moddleExtensions;
    },
  },
};
</script>

<style scoped></style>
