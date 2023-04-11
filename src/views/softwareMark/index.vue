<template>
  <b-card no-body>
    <b-overlay :show="show">
      <!-- 头 -->
      <div class="mt-2 ml-2 d-flex justify-content-lg-start">
        <b-form class="d-flex " autocomplete="off">
          <b-form-input class="w25 mr-1" placeholder="请输入要查询的软件名称" />
          <v-select style="width:12.5rem" class="mr-1" />
        </b-form>
        <b-button variant="success"> <feather-icon icon="SearchIcon" /> 查询</b-button>
      </div>
      <!-- 内容 -->
      <div class="mt-2">
        <b-table :fields="isFields" :items="isItems" tbody-tr-class="tableTr" show-empty striped responsive>
          <template #empty="scope">
            <div class="d-flex justify-content-center" style="font-weight: 400; font-size: 16px; color: #afafaf;">暂无数据</div>
          </template>
          <template #cell(actions)="data">
            <div class="d-flex justify-content-end">
              <feather-icon icon="EditIcon" :id="`edit_${data.index}`" style="cursor: pointer;" size="16" />
              <b-tooltip :target="`edit_${data.index}`" placement="left" title="编辑信息" />
            </div>
          </template>
        </b-table>
      </div>
      <!-- 底部 -->
      <div class="d-flex  ml-2 justify-content-between">
        <div>共{{ count }}条</div>
        <div class="d-flex justify-content-between">
          <b-pagination class="mr-50"></b-pagination>
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
      count: 1000
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
