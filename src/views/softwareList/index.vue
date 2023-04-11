<template>
  <b-card no-body>
    <div class="bar mt-2 ml-2 d-flex ">
      <div class="d-flex justify-content-between">
        <b-form autocomplete="off">
          <b-form-input class="w25 mr-1" placeholder="请输入需要查询的软件名称" />
        </b-form>
        <div>
          <b-button variant="success"><feather-icon icon="SearchIcon" />查询</b-button>
          <b-button variant="info">下载软件规则</b-button>
        </div>
        <div>
          <b-button variant="primary"><feather-icon icon="PlusIcon" />添加</b-button>
        </div>
      </div>
    </div>
  </b-card>
</template>


<style lang="less" scoped>
.w25 {
  width: 25rem;
  max-width: 25rem;
}
</style>