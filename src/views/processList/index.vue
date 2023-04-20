<template>
  <b-card no-body>
    <b-overlay :show="show">
      <!-- 头 -->
      <div class="mt-2 ml-2 d-flex justify-content-lg-start">
        <b-form class="d-flex " autocomplete="off">
          <b-form-input class="w25 mr-1" placeholder="请输入要查询的进程名称" v-model="searchVal" />
          <v-select style="width:12.5rem" class="mr-1" :options="statusOptions" :reduce="(name) => name.id" label="name" :clearable="false" :searchable="false" v-model="status" />
        </b-form>
        <b-button variant="success" @click="searchBtn"> <feather-icon icon="SearchIcon" /> 查询</b-button>
      </div>
      <!-- 内容 -->
      <div class="mt-2">
        <b-table :fields="isFields" :items="isItems" tbody-tr-class="tableTr" show-empty striped responsive>
          <!-- 无数据展示 -->
          <template #empty="scope">
            <div class="d-flex justify-content-center" style="font-weight: 400; font-size: 16px; color: #afafaf;">暂无数据</div>
          </template>
          <!-- 过滤流量 -->
          <template #cell(filter_traffic)="data">
            {{ findLabel(filterOptions,data.item.filter_traffic) }}
          </template>
          <!-- 泄密类型 -->
          <template #cell(leak_type)="data">
            {{ findLabel(leakTypeOptions,data.item.leak_type)}}
          </template>
          <!-- 透明加解密 -->
          <template #cell(support_des)="data">
            <b-badge v-if="data.item.support_des !== null" pill :variant="variantEnum[data.item.support_des]">
              {{ findLabel(supportOptions,data.item.support_des ) }}
            </b-badge>
          </template>
          <!-- 操作 -->
          <template #cell(actions)="data">
            <div class="d-flex justify-content-end">
              <feather-icon icon="EditIcon" :id="`edit_${data.index}`" style="cursor: pointer;" size="16" @click="isButton(data.item)" />
              <b-tooltip :target="`edit_${data.index}`" placement="left" title="编辑信息" />
            </div>
          </template>
        </b-table>
      </div>
      <!-- 底部 -->
      <div class="d-flex  ml-2 justify-content-between">
        <div>共{{ count }}条</div>
        <div class="d-flex justify-content-between">
          <b-pagination class="mr-50" v-model="page" :per-page="size" :total-rows="count" @change="changePage" />
          <div class="d-flex align-items-baseline">
            <span class="mr-50">前往</span>
            <b-form-input style="height:32px;width:50px" class="mr-50" v-model="number" @keyup.enter.native="pageNumber" type="number" autocomplete="off" />
            <span class="mr-2">页</span>
          </div>
        </div>
      </div>
    </b-overlay>
  </b-card>
</template>

<script>
import { statusOptions, filterOptions, supportOptions, leakTypeOptions } from "./js/options";
import { processList } from "./js/api";
export default {
  name: 'processList',
  components: {
  },
  data() {
    return {
      show: false,
      isFields: [
        { key: 'name', label: '名称' },
        { key: 'software_name', label: '关联软件' },
        { key: 'filter_traffic', label: '过滤流量' },
        { key: 'piracy_rules', label: '盗版软件规则' },
        { key: 'encryption_rules', label: '加密规则' },
        { key: 'leak_type', label: '涉密类型' },
        { key: 'support_des', label: '透明加解密' },
        { key: 'actions', label: '操作', thStyle: 'width:100px' }
      ],
      isItems: [],
      page: 1,
      size: 50,
      count: 1000,
      searchVal: '',  //搜索内容
      status: null, //下拉值
      number: '', //跳页
      // 下拉使用
      statusOptions,
      filterOptions,
      supportOptions,
      leakTypeOptions,
      // 标签样式
      variantEnum: {
        0: "danger",
        1: "success",
      },
    }
  },
  mounted() {
    this.getProcessList()
  },
  methods: {
    //跳转界面
    isButton(item) {
      const name = item.name;
      const company = item.company;
      const description = item.description;
      const product_name = item.product_name;
      this.$router.push({
        name: 'processlistEdit',
        query: { name, company, description, product_name }
      })
    },
    // 获取列表
    async getProcessList() {
      this.show = true
      try {
        const { data } = await processList({
          page: this.page,
          size: this.size,
          keywords: this.searchVal,
          status: this.status
        });
        this.isItems = data.data;
        this.count = data.count
      } catch (error) {

      }
      this.show = false
    },
    // 回显数据
    findLabel(params, id) {
      let items = []
      params.forEach((item) => {
        if (item.id === id) {
          items.push(item.name)
        }
      });
      return items.toString()
    },
    // 分页
    changePage(e) {
      this.page = e;
      this.getProcessList()
    },
    // 跳页查询
    pageNumber() {
      this.page = this.number
      this.getProcessList();
    },
    // 模糊查询
    searchBtn() {
      this.page = 1;
      this.getProcessList();
    }
  },
}
</script>

<style lang="less" scoped>
.w25 {
  width: 25rem !important;
  max-width: 25rem !important;
}
</style>

<style lang="less">
.tableTr td {
  // background-color: pink;
  max-width: 10rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>