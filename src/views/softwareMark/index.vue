<template>
  <b-card no-body>
    <b-overlay :show="show">
      <!-- 头 -->
      <div class="mt-2 ml-2 d-flex justify-content-lg-start">
        <b-form class="d-flex " autocomplete="off">
          <b-form-input class="w25 mr-1" placeholder="请输入要查询的软件名称" @keyup.enter="SearchInfo" v-model="searchVal" />
          <v-select style="width:12.5rem" class="mr-1" :options="statusOptions" :reduce="(name) => name.id" label="name" :searchable="false" :clearable="false" v-model="status" />
        </b-form>
        <b-button variant="success" @click="SearchInfo"> <feather-icon icon="SearchIcon" /> 查询</b-button>
      </div>
      <!-- 内容 -->
      <div class="mt-2">
        <b-table :fields="isFields" :items="isItems" tbody-tr-class="tableTr" show-empty striped responsive>
          <template #empty="scope">
            <div class="d-flex justify-content-center" style="font-weight: 400; font-size: 16px; color: #afafaf;">暂无数据</div>
          </template>
          <!-- 图标 -->
          <template #cell(icon)="data">
            <img v-if="data.item.icon" :src="`data:image/jpg;base64,${data.item.icon}`" style="width: 30px; height: 30px">
            <img v-else src="https://src.onlinedown.net/d/file/20140304/1.jpg" style="width: 30px; height: 30px" />
          </template>
          <!-- 付费类型 -->
          <template #cell(payment_type)="data">
            <b-badge v-if="data.item.payment_type != null" pill :variant="variantPayment[data.item.payment_type]">
              {{ findLabel(paymentOptions,data.item.payment_type) }}</b-badge>
          </template>
          <!-- 过滤流量 -->
          <template #cell(filter_traffic)="data">
            {{findLabel(filterOptions,data.item.filter_traffic) }}
          </template>
          <!-- 级别 -->
          <template #cell(positive_level)="data">
            {{ findLabel(positiveOptions,data.item.positive_level) }}
          </template>
          <!-- 透明加解密 -->
          <template #cell(support_des)="data">
            <b-badge pill :variant="variantEnum[data.item.support_des]">
              <div v-if="data.item.filter_traffic != null">
                {{ findLabel(supportOptions,data.item.support_des) }}
              </div>
            </b-badge>
          </template>
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
            <b-form-input autocomplete="off" v-model="number" style="max-width:50px;max-height: 32px;" class="mr-50" @keyup.enter.native="pageNumber" />
            <span class="mr-2">页</span>
          </div>
        </div>
      </div>
    </b-overlay>
  </b-card>
</template>
  
  <script>
import { softwareList, softwareIcon } from "./js/api";
import { filterOptions, paymentOptions, positiveOptions, statusOptions, supportOptions } from "./js/options";
export default {
  name: 'softwareMark',
  components: {
  },
  data() {
    return {
      show: false,
      isFields: [
        { key: 'sync_name', label: '软件名称' },
        { key: 'icon', label: '图标' },
        { key: 'name', label: '软件正式名称' },
        { key: 'official_name', label: '发布者正式名称' },
        { key: 'type_name', label: '软件类别' },
        { key: 'tags_name', label: '软件标签' },
        { key: 'payment_type', label: '付费类型' },
        { key: 'filter_traffic', label: '过滤流量' },
        { key: 'positive_level', label: '级别' },
        { key: 'support_des', label: '透明加解密' },
        { key: 'actions', label: '操作' }
      ],
      isItems: [],
      page: 1,
      size: 50,
      count: 0,
      searchVal: '',
      status: null,
      number: '',
      // 声明下拉选项
      filterOptions, paymentOptions, positiveOptions, statusOptions, supportOptions,
      variantPayment: {
        1: "success",
        2: "danger",
        3: "warning",
        4: "info",
      },
      variantEnum: {
        0: "danger",
        1: "success",
      },
    }
  },
  mounted() {
    this.getSoftwareList()
  },
  methods: {
    isButton(item) {
      console.log(item, 'item');
      const software = item.sync_name;
      const softwareId = item.software_sync_id;
      const publisherName = item.sync_publisher
      this.$router.push({
        name: 'softwareMarkEdit',
        query: { software, softwareId, publisherName }
      })
    },
    // 搜索查询
    SearchInfo() {
      this.page = 1;
      this.getSoftwareList()
    },
    // 跳转指定页面
    pageNumber() {
      this.page = this.number
      this.getSoftwareList()
    },
    // 点击切换页
    changePage(e) {
      this.page = e;
      this.getSoftwareList()
    },
    // 获取列表、图标
    async getSoftwareList() {
      this.show = true
      const { data } = await softwareList({
        page: this.page,
        size: this.size,
        keywords: this.searchVal,
        status: this.status
      })
      this.isItems = data.data
      this.count = data.count
      this.show = false
      this.isItems.forEach(async (e) => {
        if (e.id) {
          const { data } = await softwareIcon({
            id: e.id
          })
          this.$set(e, 'icon', data)
        }
      })
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
  max-width: 9rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>