<template>
  <div>
    <div class="toolbar">
      <el-button type="primary" @click="openNewDialog">添加流程</el-button>
    </div>
    <!-- <element-table
      :url="url"
      :page-size="10"
      :columns="columns"
      ref="elementTable"
    ></element-table> -->

    <el-table :data="tableData">
      <el-table-column prop="id" label="流程id" width="180"></el-table-column>
      <el-table-column
        prop="name"
        label="流程名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{row}">
          {{ row.status === 0 ? "禁用" : "启用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button @click="handleUpdate(row)" type="warning">修改</el-button>
          <el-button @click="delProcess(row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="流程图"
      :visible.sync="dialogVisible"
      width="1100px"
      top="5vh"
      v-if="dialogVisible"
    >
      <slot name="-" style="border: none;padding: 0px;margin: 0px;">
        <vue-bpmn
          style="overflow: hidden;height: 800px;"
          product="flowable"
          @processSave="processSave"
          :processData="processData"
          :mode="dialogMode"
        ></vue-bpmn>
      </slot>
    </el-dialog>
  </div>
</template>

<script>
// import ElementTable from "../../components/element/ElementTable";
import VueBpmn from "../../components/bpmn/VueBpmn";
import { getProcessList, setProcess ,delProcess} from "@/api/process";

export default {
  name: "design",
  data() {
    return {
      dialogMode: "create",
      dialogVisible: false,
      url: this.Apis.processList,
      columns: [
        {
          key: "procId",
          title: "流程定义ID",
        },
        {
          key: "name",
          title: "流程名称",
        },
        {
          key: "status",
          title: "状态",
          formatter: (row, key) => {
            if (row[key] == 0) {
              return "未发布";
            }
            return "已发布";
          },
        },
        {
          key: "ora",
          title: "操作",
          operator: [
            {
              name: "发布",
              type: "text",
              click: (row) => {
                this.put(
                  this.Apis.processDeploy.replace("${id}", row.id),
                  {},
                  (res) => {
                    console.log(res);
                  }
                );
              },
              hidden: (row) => {
                return row.status == 1;
              },
            },
            {
              name: "删除",
              type: "text",
              click: (row) => {
                this.delete(
                  this.Apis.processRemove.replace("${id}", row.id),
                  {},
                  (res) => {
                    console.log(res);
                    if (res.code == 200) {
                      this.$refs.elementTable.reload();
                    }
                  }
                );
              },
            },
          ],
        },
      ],
      tableData: [
        {
          id: 123,
          name: "123",
          status: 0,
        },
      ],
      //流程数据对象
      processData: {},
    };
  },
  components: {
    // ElementTable,
    VueBpmn,
  },
  async mounted() {
    await this.getProcessList();
  },

  methods: {
    //修改流程
    handleUpdate(row) {
      this.dialogMode = "edit";
      this.processData = JSON.parse(JSON.stringify(row));

      this.dialogVisible = true;
    },
    //删除流程
    delProcess(id) {
      this.$confirm('确定删除吗？','提示').then(async () => {
        const res = await delProcess({id})
        if(res) {
          this.tableData = res.data.data
          this.$message.success('删除成功')
        }
      })
    },
    //添加流程
    async setProcess(data) {
      const res = await setProcess(data);
      this.tableData = res.data.data;
    },
    //获取列表
    async getProcessList() {
      const {
        data: { data },
      } = await getProcessList();

      this.tableData = data;
    },
    openNewDialog() {
      this.dialogMode = "create";
      this.dialogVisible = true;
    },
    async processSave(data) {
      // let that = this;
       await this.setProcess(data);
       this.dialogVisible = false
       this.$message.success('保存成功')
      // that.post(this.Apis.processBuffer, data, res => {
      //   if (res.code == 200) {
      //     that.$refs.elementTable.reload();
      //   }
      // })
    },
    deploy() {},
  },
};
</script>

<style scoped></style>
