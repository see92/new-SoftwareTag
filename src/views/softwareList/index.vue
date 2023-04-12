<template>
  <b-card no-body>
    <b-overlay :show="show">
      <!-- 头部 -->
      <div class="d-flex justify-content-between mt-2 ml-2">
        <b-form class="d-flex">
          <b-form-input class="w25 mr-1" placeholder="请输入需要查询的软件名称" />
          <b-button variant="success" class="mr-1"> <feather-icon icon="SearchIcon" /> 查询</b-button>
          <b-button variant="info"> <feather-icon icon="UploadIcon" /> 下载软件规则 </b-button>
        </b-form>
        <div class="mr-2">
          <b-button variant="primary"> <feather-icon icon="PlusIcon" /> 添加</b-button>
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
          <template #cell(icon)="data">
            <img :src="`data:image/jpg;base64,${data.item.icon}`" style="width: 30px; height: 30px">
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
            <b-form-input style="height:32px;width:50px" class="mr-50" />
            <span class="mr-2">页</span>
          </div>
        </div>
      </div>
    </b-overlay>
  </b-card>
</template>

<script>
import { softwareList } from "./js/api";
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
      searchVal: ''
    }
  },
  mounted() {
    this.getSoftwareList()
  },
  methods: {
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
        console.log(data, 'data');
      } catch (error) {

      }
      this.show = false
    },
    // 点击页码
    changePage(e) {
      this.page = e;
      this.getSoftwareList()
    }
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
  max-width: 10rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>