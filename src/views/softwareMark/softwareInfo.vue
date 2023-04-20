<template>
  <b-card no-body>
    <b-overlay :show="show">
      <!-- 头部 -->
      <div class="ml-2 mt-2 d-flex">
        <feather-icon icon="ClipboardIcon" size="19" />
        <h4 class="ml-50">{{ msg }}</h4>
      </div>

      <!-- 内容信息 -->
      <b-form class="mt-2 ml-2 mr-2">
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group label="软件名称：" label-cols-md='2'>
              <b-form-input disabled :value="softwareName" />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="发布者名称：" label-cols-md='2'>
              <b-form-input disabled :value="publisherName" />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>

      <!-- 表格 -->
      <b-card no-body class="border mt-1 mr-2 ml-2">
        <b-card-header class="p-1">
          <b-card-title class="font-medium-2">
            <feather-icon icon="EditIcon" size="19" />
            <span class="ml-50 align-middle">选择软件</span>
          </b-card-title>
        </b-card-header>
        <b-table :fields="isFields" :items="isItems" tbody-tr-class="tableTr" selectable select-mode="single" @row-selected="onRowSelected" show-empty>
          <!-- 无内容提示 -->
          <template #empty="scope">
            <div class="d-flex justify-content-center" style="font-size: 16px; font-weight: 400; color: #afafaf">
              暂未匹配到软件
            </div>
          </template>
          <!-- 单选框 -->
          <template #cell(radio)="data">
            <b-form-radio class="radio-w-h" name="radio" plain v-model="selected.id" :value="data.item.id" />
          </template>
          <!-- 软件图标 -->
          <template #cell(icon)="data">
            <img v-if="data.item.icon" :src="`data:image/jpg;base64,${data.item.icon}`" style="width: 30px; height: 30px" />
            <img v-else src="https://src.onlinedown.net/d/file/20140304/1.jpg" style="width: 30px; height: 30px">
          </template>
          <!-- 付费类型 -->
          <template #cell(payment_type)="data">
            <b-badge pill :variant="variantPayment[data.item.payment_type]">
              {{ findLabel(paymentOptions,data.item.payment_type) }}
            </b-badge>
          </template>
          <!-- 过滤流量 -->
          <template #cell(filter_traffic)="data">
            {{ findLabel(filterOptions,data.item.filter_traffic) }}
          </template>
          <!-- 积极消极级别 -->
          <template #cell(positive_level)="data">
            {{ findLabel(positiveOptions,data.item.positive_level) }}
          </template>
          <!-- 透明加解密 -->
          <template #cell(support_des)="data">
            <b-badge pill :variant="variantEnum[data.item.support_des]">
              <div v-if="data.item.support_des !== '' && data.item.support_des !== null ">
                {{ findLabel(supportOptions,data.item.support_des) }}
              </div>
            </b-badge>
          </template>
          <!-- 操作 -->
          <template #cell(actions)="data">
            <div class="d-flex">
              <feather-icon icon="EditIcon" :id="`edit_${data.index}`" size="16" class="cursor-pointer mr-50" @click.stop="isActions(0,data.item)" />
              <b-tooltip title="编辑信息" :target="`edit_${data.index}`" placement="left" />
              <feather-icon icon="Trash2Icon" :id="`trash_${data.index}`" size="16" class="cursor-pointer" @click.stop="isActions(1,data.item)" />
              <b-tooltip title="删除信息" :target="`trash_${data.index}`" placement="left" />
            </div>
          </template>
        </b-table>
      </b-card>

      <div class="d-flex justify-content-between mr-2 ml-2 mb-2">
        <div>
          <b-button variant="primary" class="mr-1" @click="eButton(0)">关联</b-button>
          <b-button variant="outline-primary" @click="eButton(1)">取消</b-button>
        </div>
        <b-button variant="success" @click="addSoftware">新增软件</b-button>
      </div>
      <div>
        <!-- 删除 -->
        <b-modal v-model="delModal" size="sm" centered title="提示：" hide-footer no-close-on-backdrop>
          <div class="d-flex justify-content-center">此操作将会删除数据，是否继续？</div>
          <div class="d-flex mt-1 justify-content-end">
            <b-button variant="danger" class="mr-1" @click="del_button(0)">确定</b-button>
            <b-button variant="outline-danger" @click="del_button(1)">取消</b-button>
          </div>
        </b-modal>
      </div>
    </b-overlay>
  </b-card>
</template>

<script>
import { toast } from '@/assets/js/toast';
import { softwareRule, softwareIcon, delSoftwareRule, getRelated } from "./js/api";
import { paymentOptions, filterOptions, positiveOptions, supportOptions } from "./js/options";
export default {
  name: 'markInfo',
  components: {
  },
  data() {
    return {
      show: false,
      msg: '关联软件',
      softwareName: this.$route.query.software,
      publisherName: this.$route.query.publisherName,
      softwareId: this.$route.query.softwareId,
      isFields: [
        { key: "radio", label: "" },
        { key: "icon", label: "图标", thStyle: "width:60px" },
        { key: "name", label: "软件名称" },
        { key: "type_name", label: "软件类别" },
        { key: "name_match_rule", label: "匹配规则" },
        { key: "official_name", label: "发布者正式名称 " },
        { key: "payment_type", label: "付费类型" },
        { label: "过滤流量", key: "filter_traffic" },
        { key: "positive_level", label: "积极消极级别", },
        { key: "support_des", label: "透明加解密", },
        { key: "actions", label: "操作" },
      ],
      isItems: [],
      selected: {},
      //   声明下拉选项
      paymentOptions, filterOptions, positiveOptions, supportOptions,
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
      delModal: false
    }
  },
  mounted() {
    this.getSoftwareRule()
  },
  methods: {
    // 添加软件
    addSoftware() {
      const [softwareName, pubName, flag, mark] = [this.softwareName, this.publisherName, 0, 'mark'];
      this.$router.push({
        name: 'softwareListAdd',
        query: { flag, softwareName, pubName, mark }
      })
    },
    // 关联软件
    async eButton(flag) {
      if (flag == 0) {
        console.log(this.softwareId, this.selected.id);
        if (!this.softwareId || !this.selected.id) {
          toast("XCircleIcon", "danger", '请选择一项软件关联')
          return
        } else {
          const { status } = await getRelated(this.softwareId, this.selected.id)
          if (status == 200) {
            toast("CheckIcon", 'success', '关联成功！');
            this.$router.back()
          }
        }
      } else if (flag == 1) {
        this.$router.back()
      }

    },
    // 删除按钮
    async del_button(flag) {
      if (flag == 0) {
        try {
          const { status } = await delSoftwareRule({
            id: this.delId
          })
          if (status == 200) {
            toast("CheckIcon", "success", '删除成功！')
          }
        } catch (error) {
          toast("XCircleIcon", "danger", error)
        }
        this.getSoftwareRule();
      } else if (flag == 1) {
        this.delModal = false
      }
      this.delModal = false
    },
    // 操作按钮
    isActions(flag, item) {
      if (flag == 0) {
        const [id, softwareName, pubName, flag, mark] = [item.id, this.softwareName, this.publisherName, 1, 'mark'];
        this.$router.push({
          name: 'softwareListEdit',
          query: { id, flag, softwareName, pubName, mark }
        })
      } else if (flag == 1) {
        this.delModal = true;
        this.delId = item.id;
        console.log(this.delId);
      }
    },
    onRowSelected(items) {
      if (items.length) {
        this.selected = items[0]
      }
    },
    // 获取软件列表
    async getSoftwareRule() {
      this.show = true
      try {
        const { data } = await softwareRule(this.softwareName, this.softwareId)
        this.isItems = data.list;
        this.show = false
        this.selected.id = data.software_id;
        this.isItems.forEach(async (e) => {
          const { data } = await softwareIcon({
            id: e.id
          })
          this.$set(e, 'icon', data);
        })
      } catch (error) { }

    },
    // 回显label
    findLabel(params, id) {
      let items = [];
      params.forEach((item) => {
        if (item.id === id) {
          items.push(item.name)
        }
      });
      return items.toString()
    }
  },
}
</script>

<style lang="less">
.tableTr td {
  max-width: 13rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>