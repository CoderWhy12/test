<template>
  <div>
    <el-button-group>
      <el-tooltip
        class="item"
        effect="dark"
        content="保存并发布"
        placement="bottom"
      >
        <el-button type="primary" size="mini" @click="deploy"
          ><i class="fa fa-save"> 保存并发布</i></el-button
        >
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="保存草稿"
        placement="bottom"
      >
        <el-button type="danger" size="mini" @click="save"
          ><i class="fa fa-save"> 测试保存(mock)</i></el-button
        >
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="打开流程文件"
        placement="bottom"
      >
        <el-button type="primary" size="mini"
          ><i class="fa fa-folder-open"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="创建新流程图"
        placement="bottom"
      >
        <el-button type="primary" size="mini" @click="reset"
          ><i class="fa fa-plus-circle"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="下载流程图"
        placement="bottom"
      >
        <el-button type="primary" size="mini" @click="downloadSvg"
          ><i class="fa fa-picture-o"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="下载流程文件"
        placement="bottom"
      >
        <el-button type="primary" size="mini" @click="downloadBpmn"
          ><i class="fa fa-download"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="撤销" placement="bottom">
        <el-button size="mini"
          ><i class="fa fa-rotate-left" @click="undo"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="恢复" placement="bottom">
        <el-button size="mini"
          ><i
            class="fa fa-rotate-right"
            :class="!canRedo ? 'default-undo' : ''"
            @click="redo"
          ></i
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="放大" placement="bottom">
        <el-button size="mini" @click="zoom(0.05)"
          ><i class="fa fa-search-plus"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩小" placement="bottom">
        <el-button size="mini" @click="zoom(-0.05)"
          ><i class="fa fa-search-minus"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="重置" placement="bottom">
        <el-button size="mini" @click="zoom(0)"
          ><i class="fa fa-arrows"></i
        ></el-button>
      </el-tooltip>
    </el-button-group>
  </div>
</template>

<script>
const convert = require("xml-js");
export default {
  name: "ViewerHeader",
  data() {
    return {
      scale: 1.0,
      canRedo: false,
      //节点数组
      nodeList: [],
      //json对象
      jsonData: {},
    };
  },
  props: {
    processData: {
      type: Object,
    },
    modeler: {
      type: Object,
    },
  },
  components: {},
  methods: {
    deploy() {
      let that = this;
      let _xml;
      let _svg;
      this.modeler.saveXML((err, xml) => {
        if (err) {
          console.error(err);
        }
        _xml = xml;
      });
      this.modeler.saveSVG((err, svg) => {
        if (err) {
          console.error(err);
        }
        _svg = svg;
      });
      that.post(
        this.Apis.deployProcess,
        {
          processKey: "s1111",
          processName: "阿达达",
          resourceName: "test01",
          xml: _xml,
          svg: _svg,
        },
        function(data) {
          console.log(data);
        }
      );
    },
    save() {
      let that = this;
      let _xml;
      let _svg;
      this.modeler.saveXML((err, xml) => {
        if (err) {
          console.error(err);
        }

        const processIndex = this.modeler
          .getDefinitions()
          .rootElements.findIndex((item) => item.$type === "bpmn:Process");

        if (processIndex > -1) {
          this.processObj = this.modeler.getDefinitions().rootElements[
            processIndex
          ];
        }

        //流程节点数组(过滤掉箭头节点)
        if (this.processObj.flowElements.length) {
          this.nodeList = this.processObj.flowElements.filter(
            (item) => item.$type !== "bpmn:SequenceFlow"
          );
        }

        // this.nodeList.forEach(item =>{
        //   console.log(item)
        // })

        // this.nodeList = this.nodeList.map(item =>{
        // })

        const filterKeys = [];
        this.nodeList.forEach((item) => {
          filterKeys.push(item.id);
        });

        for(let i = 0; i < this.nodeList.length;i++) {
          
        }
        const regis = this.modeler.get("elementRegistry");

        const shape = regis.get(filterKeys[0])
        console.log(shape)
        console.log(JSON.stringify(shape))

        const newAry = [];

        // for (let i in regis._elements) {
        //   if (filterKeys.includes(i)) {
        //     console.log(JSON.parse(JSON.stringify(regis._elements[i].element.businessObject)))
        //     const newObj = {};

        //     // for (let j in Object.getOwnPropertyDescriptors(
        //     //   regis._elements[i].element.businessObject
        //     // )) {
        //     //   newObj[j] = Object.getOwnPropertyDescriptors(
        //     //     regis._elements[i].element.businessObject
        //     //   )[j];
        //     // }

        //     // var cache = [];
        //     // JSON.stringify(newObj, function(key, value) {
        //     //   if (typeof value === "object" && value !== null) {
        //     //     if (cache.indexOf(value) !== -1) {
        //     //       // Circular reference found, discard key
        //     //       return;
        //     //     }
        //     //     // Store value in our collection
        //     //     cache.push(value);
        //     //   }

        //     //   console.log(cache)
        //     // });
        //     // cache = null;

        //     // newAry.push(newObj)

        //     // console.log(newObj.buss)

        //     // newAry.push(regis._elements[i].element.businessObject)
        //   }
        // }

        console.log(newAry);

        console.log(JSON.stringify(newAry));

        console.log(this.nodeList);

        _xml = xml;

        this.jsonData = convert.xml2json(xml, {
          alwaysChildren: false,
          compact: false,
          spaces: 4,
        });

        // console.log('保存后的xml',this.jsonData)
      });

      this.modeler.saveSVG((err, svg) => {
        if (err) {
          console.error(err);
        }
        _svg = svg;
      });
      that.$emit("processSave", {
        id: this.processData.key,
        name: this.processData.name,
        jsonData: this.jsonData,
        nodeList: this.nodeList,
        status: 0,
      });
    },
    reset() {
      this.$emit("restart");
    },
    downloadSvg() {
      this.$emit("handleExportSvg");
    },
    downloadBpmn() {
      this.$emit("handleExportBpmn");
    },
    undo() {
      this.modeler.get("commandStack").undo();
      this.canRedo = this.modeler.get("commandStack").canRedo();
    },
    redo() {
      if (!this.canRedo) {
        return;
      }
      this.modeler.get("commandStack").redo();
      this.canRedo = this.modeler.get("commandStack").canRedo();
    },
    zoom(val) {
      let newScale = !val
        ? 1.0
        : this.scale + val <= 0.2
        ? 0.2
        : this.scale + val;
      this.modeler.get("canvas").zoom(newScale);
      this.scale = newScale;
    },
  },
};
</script>

<style scoped></style>
