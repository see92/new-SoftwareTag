<template>
  <b-card no-body>
    <b-overlay :show="show">
      <!-- 头部 -->
      <div class="d-flex justify-content-between mt-2 ml-2">
        <div class="d-flex">
          <b-form-input autocomplete="off" v-model="searchVal" class="w25 mr-1" placeholder="请输入需要查询的软件名称" @keyup.enter="searchInfo" />
          <b-button variant="success" class="mr-1" @click="searchInfo"> <feather-icon icon="SearchIcon" /> 查询</b-button>
          <b-button variant="info" @click="uploadFile"> <feather-icon icon="UploadIcon" /> 下载软件规则 </b-button>
          <input type="file" v-show="false" ref="fileRef" @change="uploadFileWithClear($event)">
        </div>
        <div class="mr-2">
          <b-button variant="primary"> <feather-icon icon="PlusIcon" @click="isButton(0)" /> 添加</b-button>
        </div>
      </div>

      <!-- 内容 -->
      <div class="mt-2">
        <b-table :fields="isFields" :items="isItems" show-empty tbody-tr-class="tableTr" striped responsive>
          <template #empty="scope">
            <div class="d-flex justify-content-center" style="font-weight:400;font-size: 16px; color: #afafaf;">
              暂无数据
            </div>
          </template>
          <!-- 图片加载 -->
          <template #cell(icon)="data">
            <img :src="`data:image/jpg;base64,${data.item.icon}`" style="width: 30px; height: 30px">
          </template>
          <!-- 付费类型 -->
          <template #cell(payment_type)="data">
            <b-badge pill :variant="PaymentVariant[data.item.payment_type]">
              {{ findLabel(payOptions,data.item.payment_type) }}
            </b-badge>
          </template>
          <!-- 级别 -->
          <template #cell(positive_level)="data">
            {{ findLabel(lvOptions,data.item.positive_level) }}
          </template>
          <!-- 过滤流量 -->
          <template #cell(filter_traffic)="data">
            {{ findLabel(flowOptions,data.item.filter_traffic) }}
          </template>
          <!-- 涉密类型 -->
          <template #cell(leak_type)="data">
            {{ findLabel(leakTypeOptions,data.item.leak_type) }}
          </template>
          <!-- 透明加解密 -->
          <template #cell(support_des)="data">
            <b-badge :variant="supportVariant[data.item.support_des]">
              {{ data.item.support_des == 1? '支持' :'不支持' }}
            </b-badge>
          </template>
          <!-- 操作 -->
          <template #cell(actions)="data">
            <div class="d-flex">
              <feather-icon icon="EditIcon" :id="`Edit_${data.index}`" style="cursor:pointer" class="mr-50" @click="isButton(1,data.item)" />
              <b-tooltip :target="`Edit_${data.index}`" title="编辑信息" placement="left" />
              <feather-icon icon="Trash2Icon" :id="`Trash2_${data.index}`" style="cursor:pointer" @click="isButton(2,data.item)" />
              <b-tooltip :target="`Trash2_${data.index}`" title="删除信息" placement="left" />
            </div>
          </template>
        </b-table>
      </div>

      <!-- 底部 -->
      <div class="d-flex  ml-2 justify-content-between">
        <div>共{{ count }}条</div>
        <div class="d-flex justify-content-between">
          <b-pagination class="mr-50" v-model="page" :per-page="size" :total-rows="count" @change="changePage"></b-pagination>
          <div class="d-flex align-items-baseline">
            <!-- <input type="number" style="width:50px" /> -->
            <span class="mr-50">前往</span>
            <b-form-input type="number" autocomplete="off" style="height:32px;width:50px" class="mr-50" v-model="pageNum" @keyup.enter="goPage" />
            <span class="mr-2">页</span>
          </div>
        </div>
      </div>

      <!-- 弹窗 -->
      <div>
        <b-modal centered hide-footer no-close-on-backdrop v-model="isDelete" size="sm" title="提示：">
          <div class="d-flex justify-content-center">此操作将会删除数据，是否继续？</div>
          <div class="d-flex mt-1 justify-content-end">
            <b-button variant="danger" class="mr-1">确定</b-button>
            <b-button variant="outline-danger">取消</b-button>
          </div>
        </b-modal>
      </div>
    </b-overlay>
  </b-card>
</template>

<script>
import { softwareList,offlineJson } from "./js/api";
import { payOptions, lvOptions, flowOptions, leakTypeOptions } from "./js/options";
export default {
  name: 'softwareList',
  components: {},
  data() {
    return {
      show: false,
      isFields: [
        { key: 'icon', label: '图标' },
        { key: 'name', label: '软件名称' },
        { key: 'type_name', label: '软件类别' },
        { key: 'name_match_rule', label: '软件名称匹配规则' },
        { key: 'official_name', label: '发布者正式名称' },
        { key: 'friendly', label: '发布者友好名称' },
        { key: 'payment_type', label: '付费类型' },
        { key: 'positive_level', label: '级别' },
        { key: 'filter_traffic', label: '过滤流量' },
        { key: 'leak_type', label: '涉密类型' },
        { key: 'support_des', label: '透明加解密' },
        { key: 'tags_name', label: '软件标签' },
        { key: 'actions', label: '操作' }
      ],
      isItems: [],
      page: 1,
      size: 10,
      count: 0,
      searchVal: '',
      pageNum: '',
      // 下拉选项
      payOptions,
      lvOptions,
      flowOptions,
      leakTypeOptions,
      // 高亮颜色
      PaymentVariant: { 1: "success", 2: "danger", 3: "warning", 4: "info" },
      supportVariant: { 0: "danger", 1: "success" },
      isDelete: false,  //删除弹窗
    }
  },
  mounted() {
    this.getSoftwareList()
  },
  methods: {
    // 上传文件
    uploadFile() {
      this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
    },
    async uploadFileWithClear(e) {
      let file = e.target.files[0]
      let formData = new FormData()
      formData.append('file', file)
      try {
        const data = await offlineJson(formData)
        let blob = new Blob([data.data], { type: 'application/octet-stream' });
        let url = window.URL.createObjectURL(blob)
        // return
        let link = document.createElement('a');
        link.download = 'software_rule.json';
        link.href = url;
        link.click()
        //释放内存
        window.URL.revokeObjectURL(link.href)
      } catch (error) {
      }
      this.$refs.fileRef.value = "";
    },
    // 点击页码
    changePage(e) {
      this.page = e;
      this.getSoftwareList()
    },
    // 回显下拉内容
    findLabel(params, id) {
      let items = [];
      params.forEach((item) => {
        if (item.id === id) {
          items.push(item.name)
        }
      });
      return items.toString()
    },
    // 按钮操作
    isButton(flag, data) {
      if (flag == 0) {

      } else if (flag == 1) {

      } else if (flag == 2) {
        this.isDelete = true
      }
    },
    // 查询操作
    searchInfo() {
      this.page = 1
      this.getSoftwareList()
    },
    // 跳转指定页码
    goPage() {
      this.page = this.pageNum;
      this.getSoftwareList()
    },
    // 请求软件列表
    async getSoftwareList() {
      this.show = true;
      try {
        const { data } = await softwareList({
          page: this.page,
          size: this.size,
          keywords: this.searchVal,
        })
        this.count = data.count
        this.isItems = data.data
      } catch (error) {

      }
      this.show = false
    },
  },
}
</script>


<style lang="less" scoped>
.w25 {
  width: 25rem;
  max-width: 25rem;
}
</style>

<style lang="less">
.tableTr td {
  max-width: 9rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>