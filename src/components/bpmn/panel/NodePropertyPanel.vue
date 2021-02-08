<template>
  <div>
    <el-form
      :inline="false"
      label-width="100px"
      size="small"
      label-position="right"
    >
      <el-form-item label="节点类型">
        <el-input v-model="formData.type" disabled></el-input>
      </el-form-item>
      <el-form-item label="节点ID">
        <el-input v-model="formData.id" @input="updateId"></el-input>
      </el-form-item>
      <el-form-item label="节点名称">
        <el-input v-model="formData.name" @input="updateName"></el-input>
      </el-form-item>

      <!-- 记录：增加自定义code输入框 -->
      <el-form-item label="自定义code">
        <!-- 输入框形式 -->
        <!-- <el-input v-model="formData.code" @input="updateCode"></el-input> -->

        <!-- 下拉框形式 -->
        <el-select v-model="formData.code" placeholder="" @change="updateCode">
          <el-option
            v-for="(item, index) in codeList"
            :key="index"
            :label="item.label"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <div v-for="(outer, index) in defineList.rootElements" :key="index">
        <div v-for="innner in outer.flowElements" :key="innner.id">
          <div v-if="innner.$type !== 'bpmn:SequenceFlow'">
            {{ innner.name ? innner.name : "默认" }}
            ---->
      <!-- <span
              v-for="(item, index) in filterAss(innner.id, outer.flowElements)"
              :key="index"
            >
              {{ item.name }}
            </span>
          </div>
        </div>
      </div> -->
<!-- 
      <el-row
        v-for="(node, nodeIndex) in nodeList"
        :key="nodeIndex"
        style="margin-top:15px;border:1px solid red;"
      >
        <el-col :span="8">
          {{ node.name ? node.name : node.id }}
        </el-col>
        <el-col :span="4">指向--></el-col>
        <!-- <el-col :span="12" v-if="node.outgoing">
          <span
            v-for="(go, goIndex) in node.outgoing"
            :key="goIndex"
            @click="handleClick(go.targetRef.id)"
          >
            {{ go.targetRef.name ? go.targetRef.name : go.targetRef.id }}
          </span>
        </el-col>
      </el-row> --> 

      <el-row>
        <el-col :span="4" style="line-height:44px">已解决</el-col>
        <el-col :span="2">
          <el-button @click="getNextStatus">获取下一状态</el-button>
        </el-col>
        <el-col :span="5" style="line-height:44px" :offset="8">{{nextStatus}}</el-col>
      </el-row>


      <!--usertask-->
      <el-form-item v-if="formData.type == 'bpmn:UserTask'" label="节点人员">
        <el-select
          v-model="formData.userType"
          placeholder="请选择"
          @change="changeUserType"
        >
          <el-option value="assignee" label="指定人员"></el-option>
          <el-option value="candidateUsers" label="候选人员"></el-option>
          <el-option value="candidateGroups" label="角色/岗位"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="指定人员"
        v-if="
          formData.type == 'bpmn:UserTask' && formData.userType === 'assignee'
        "
      >
        <el-select
          v-model="formData.assignee"
          placeholder="请选择"
          key="1"
          @change="(value) => addUser({ assignee: value })"
        >
          <el-option
            v-for="item in bpmnData.assignees"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="候选人员"
        v-else-if="
          formData.type == 'bpmn:UserTask' &&
            formData.userType === 'candidateUsers'
        "
      >
        <el-select
          v-model="formData.candidateUsers"
          placeholder="请选择"
          key="2"
          multiple
          @change="
            (value) => addUser({ candidateUsers: value.join(',') || value })
          "
        >
          <el-option
            v-for="item in bpmnData.candidateUsers"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="角色/岗位"
        v-else-if="
          formData.type == 'bpmn:UserTask' &&
            formData.userType === 'candidateGroups'
        "
      >
        <el-select
          v-model="formData.candidateGroups"
          placeholder="请选择"
          @change="(value) => addUser({ candidateGroups: value })"
        >
          <el-option
            v-for="item in bpmnData.roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--sequenceFlow-->
      <el-form-item
        v-if="formData.type == 'bpmn:SequenceFlow'"
        label="分支条件"
      >
        <el-input
          v-model="formData.sequenceFlow"
          @input="updateSequenceFlow"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import template from '../data/template';
import { debounce } from "lodash";
export default {
  name: "NodePropertyPanel",
  data() {
    return {
      nextStatus:'',
      bpmnData: {
        assignees: [
          {
            value: "${assignee}",
            label: "表达式",
          },
          {
            value: "1001",
            label: "张三",
          },
          {
            value: "1002",
            label: "李四",
          },
          {
            value: "1003",
            label: "王五",
          },
        ],
        candidateUsers: [
          {
            value: "1001",
            label: "张三",
          },
          {
            value: "1002",
            label: "李四",
          },
          {
            value: "1003",
            label: "王五",
          },
        ],
        roles: [
          {
            value: "manager",
            label: "经理",
          },
          {
            value: "personnel",
            label: "人事",
          },
          {
            value: "charge",
            label: "主管",
          },
        ],
      },
      defineList: [],
      processObj: {},
      nodeList: [],
      //绑定code
      code: "new",
      //记录·1 准备下拉框数组
      codeList: [
        {
          label: "new",
          code: "new",
        },
        {
          label: "open",
          code: "open",
        },
        {
          label: "distribution",
          code: "distribution",
        },
        {
          label: "progress",
          code: "progress",
        },
        {
          label: "sloved",
          code: "sloved",
        },
        {
          label: "feedback",
          code: "feedback",
        },
        {
          label: "closed",
          code: "closed",
        },
        {
          label: "test",
          code: "test",
        },
      ],
    };
  },
  props: {
    modeler: {
      type: Object,
      required: true,
    },
    nodeElement: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  watch: {
    nodeList: {
      handler() {},
    },
    nodeElement: {
      handler() {
        console.log(this.nodeElement);
        if (this.nodeElement.type == "bpmn:StartEvent") {
          this.updateName("开始");
        }
        if (this.nodeElement.type == "bpmn:EndEvent") {
          this.updateName("结束");
        }
      },
    },
    modeler: {
      handler: debounce(
        function(val) {
          setTimeout(() => {
            //流程对象
            const processIndex = val
              .getDefinitions()
              .rootElements.findIndex((item) => item.$type === "bpmn:Process");

            if (processIndex > -1) {
              this.processObj = val.getDefinitions().rootElements[processIndex];
            }

            //流程节点数组(过滤掉箭头节点)
            if (this.processObj.flowElements.length) {
              this.nodeList = this.processObj.flowElements.filter(
                (item) => item.$type !== "bpmn:SequenceFlow"
              );
              console.log(this.nodeList);
              //获取网关出口顺序流name为是的下一状态
              if (this.nodeList.length) {
                //找到网关
                const index = this.nodeList.findIndex(
                  (item) => item.$type === "bpmn:ExclusiveGateway"
                );
                if (index > -1) {
                  const gateWay = this.nodeList[index];
                  if (gateWay.outgoing) {
                    //获取name为'是'的顺序流
                    const isYes = gateWay.outgoing.find(
                      (item) => item.name && item.name === "是"
                    );
                    if (isYes) {
                      console.log(isYes.targetRef);
                    }
                  }
                }
              }
            }
          });
        },
        1000,
        {
          leading: true,
        }
      ),
      deep: true,
      immediate: true,
    },
  },
  async mounted() {
    this.modeler.on("element.changed", (e) => {
      const { element } = e;
      if (!element) {
        return;
      }
    });

    this.modeler.on("element.click", (e) => {
      const { element } = e;
      if (!element) {
        return;
      }

      // const registry = this.modeler.get("elementRegistry");

      // const ele = registry.get("IntermediateThrowEvent_10diphj");

      // console.log(ele);

      // const modeling = this.modeler.get("modeling");
    });
    // console.log(1);
    // for (let i in this.modeler) {
    //   // console.log(i);
    // }
    // setTimeout(() => {
    //   console.log(this.modeler.getDefinitions());
    // });
    //  console.log(this.modeler.getDefinitions())
    // let processId = new Date().getTime()
    // this.inTemplate = templateXml.initTemplate(processId)
    // this.initData = {
    //   key:'process' + processId,
    //   name:'流程' + processId,
    //   xml:this.initTemplate
    // }

    // console.log(this.modeler.get("elementRegistry"));
    console.log(this.modeler.get("modeling"));
  },

  methods: {
    getNextStatus(){
      //获取已解决节点的下一状态
              const regis = this.modeler.get("elementRegistry");

        const shape = regis.get('StartEvent_01ydzqe')
        const newStatus = shape.businessObject.outgoing[0].targetRef
        if(newStatus.$type === 'bpmn:ExclusiveGateway') {
          this.$confirm(`${newStatus.name}`,'提示',{
            confirmButtonText:'是',
            cancelButtonText:'否'
          }).then(res => {
            const isYes = newStatus.outgoing.find(item => item.name === '是')
            this.nextStatus = isYes.targetRef.name
          }).catch(err => {
            const isNo = newStatus.outgoing.find(item => item.name === '否')
            this.nextStatus = isNo.targetRef.name
          })
        }
    },
    getNodeList() {},
    filterAss(id, flow) {
      const arrList = flow.filter((item) => {
        return item.$type === "bpmn:SequenceFlow";
      });
      const nameList = [];
      arrList.forEach((item) => {
        if (item.sourceRef.id === id) {
          nameList.push({ id: item.targetRef.id });
        }
      });

      for (let i = 0; i < flow.length; i++) {
        for (let j = 0; j < nameList.length; j++) {
          if (flow[i].id === nameList[j].id) {
            nameList[j].name = flow[i].name || "默认流程";
          }
        }
      }
      return nameList;
    },
    updateProperties(properties) {
      console.log(this.modeler.get("modeling"));

      //记录：调用修改属性api
      this.modeler
        .get("modeling")
        .updateProperties(this.nodeElement, properties);

      console.log(this.nodeElement);
    },
    updateId(name) {
      this.updateProperties({ id: name });
    },
    updateName(name) {
      this.updateProperties({ name: name });
    },
    updateCode(code) {
      this.updateProperties({ code: code });
    },
    changeUserType() {},
    updateSequenceFlow(val) {
      let newCondition = this.modeler
        .get("moddle")
        .create("bpmn:FormalExpression", {
          body: val,
        });
      this.updateProperties({ conditionExpression: newCondition });
    },
    addUser(properties) {
      this.updateProperties(properties);
      Object.assign(properties, {
        userType: Object.keys(properties)[0],
      });
      this.$emit("modifyFormData", properties);
    },
  },
};
</script>

<style scoped></style>
