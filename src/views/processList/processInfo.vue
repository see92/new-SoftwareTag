<template>
  <b-card no-body>
    <!-- 头部 -->
    <div class="d-flex mt-2 ml-2">
      <feather-icon icon="EditIcon" size="19" class="mr-50" />
      <h4>{{ msg }}</h4>
    </div>
    <!-- 内容信息 -->
    <div class="mt-1">
      <b-form class="form" autocomplete="off">
        <!-- 进程名称 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="进程名称：" label-for="name" label-cols-md="auto">
              <b-form-input class="w34" disabled v-model="process.name" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- 公司名称 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="公司名称：" label-for="name" label-cols-md="auto">
              <b-form-input class="w34" disabled v-model="process.company" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- 产品描述 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="产品描述：" label-for="name" label-cols-md="auto">
              <b-form-input class="w34" disabled v-model="process.description" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- 产品名称 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="产品名称：" label-for="name" label-cols-md="auto">
              <b-form-input class="w34" disabled v-model="process.product_name" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- 过滤流量 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="过滤流量" label-for="name" label-cols-md="auto">
              <v-select class="w34" :reduce="(name) => name.id" label="name" :searchable="false" :clearable="false" :options="filterOptions" placeholder="请选择过滤类型" v-model="process.filter_traffic" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- 盗版软件规则 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="盗版软件规则：" label-for="name" label-cols-md="auto">
              <b-form-input class="w34" v-model="process.piracy_rules" placeholder="请输入盗版软件规则" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- 加密规则 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="加密规则：" label-for="name" label-cols-md="auto">
              <b-form-input class="w34" v-model="process.encryption_rules" placeholder="请输入加密规则" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- 泄露类型 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="泄露类型：" label-for="leakType" label-cols-md="auto">
              <v-select class="w34" :reduce="(name) => name.id" label="name" :searchable="false" :clearable="false" :options="leakTypeOptions" placeholder="请选择泄密类型" v-model="process.leak_type" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- 透明加解密 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="透明加解密：" label-for="name" label-cols-md="auto">
              <v-select class="w34" :options="supportOptions" :reduce="(name) =>name.id" :clearable="false" :searchable="false" label="name" v-model="process.support_des" />
            </b-form-group>
          </b-col>
        </b-row>
        <!-- 关联软件 -->
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group label="关联软件：" label-for="software" label-cols-md="auto">
              <b-input-group append="选择软件">
                <b-form-input placeholder="请选择软件" readonly style="background-color: #fff;" v-model="selected.name" @click="showTable" />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </div>
    <hr />
    <div class="d-flex justify-content-center">
      <b-button variant="primary" class="mr-1" @click="submit(0)">保存</b-button>
      <b-button variant="outline-primary" @click="submit(1)">取消</b-button>
    </div>
    <!-- 弹窗 -->
    <div>
      <b-modal v-model="isModal" size="xl" no-close-on-backdrop hide-footer centered body-class="bodyClass" title="选择软件">
        <b-overlay :show="show">
          <div class="ml-2 d-flex justify-content-between mb-1">
            <div class="d-flex">
              <b-form-input autocomplete="off" size="sm" placeholder="请输入要查询的内容" style="width: 100%" class="mr-1" v-model="searchVal" @keyup.enter="search" />
              <b-button size="sm" variant="success" style="width: 100px" @click="search">查询</b-button>
            </div>
            <div class="d-flex align-items-center mr-2">
              <div v-if="selectedInfo.id">
                已选择软件
                <b-badge variant="light-dark">{{ selectedInfo.name }}</b-badge>
              </div>
            </div>
          </div>
          <div>
            <b-table show-empty small class="text-nowrap" responsive selectable selectMode="single" @row-selected="onRowSelected" :fields="isFields" :items="isItems">
              <!-- 无内容显示 -->
              <template #empty="scope">
                <div class="d-flex justify-content-center" style="font-weight:400;font-size: 16px; color: #afafaf;">
                  暂无数据
                </div>
              </template>
              <!-- 单选框 -->
              <template #cell(radio)="data">
                <b-form-radio class="radio-p form-check-processList" name="radio" plain v-model="selectedInfo.id" :value="data.item.id" />
              </template>
              <!-- 图标 -->
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
              <!-- 级别 -->
              <template #cell(positive_level)="data">
                {{ findLabel(positiveOptions,data.item.positive_level) }}
              </template>
              <!-- 透明加解密 -->
              <template #cell(support_des)="data">
                <b-badge pill :variant="variantEnum[data.item.support_des]">
                  <div v-if="
                data.item.support_des !== '' && data.item.support_des !== null
              ">
                    {{ findLabel(supportOptions,data.item.support_des) }}
                  </div>
                </b-badge>
              </template>
            </b-table>
          </div>
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
          <div class="d-flex justify-content-end mr-2 mb-1">
            <b-button class="mr-1" variant="primary" @click="isButton(0)">确认</b-button>
            <b-button variant="outline-primary" @click="isButton(1)">取消</b-button>
          </div>
        </b-overlay>
      </b-modal>
    </div>
  </b-card>
</template>

<script>
import { supportOptions, leakTypeOptions, filterOptions, paymentOptions, positiveOptions } from "./js/options";
import { processMsg, softwareRule, softwareIcon, updateProcess } from "./js/api";
import { toast } from '@/assets/js/toast';
export default {
  name: 'processInfo',
  components: {},
  data() {
    return {
      name: this.$route.query.name,
      company: this.$route.query.company,
      description: this.$route.query.description,
      product_name: this.$route.query.product_name,
      show: false,
      msg: '修改进程',
      process: {
        name: '',
        company: '',
        description: '',
        product_name: '',
        filter_traffic: '',
        piracy_rules: '',
        encryption_rules: '',
        leak_type: '',
        support_des: 1
      },
      selected: {},
      selectedInfo: {},
      isModal: false,   //表格弹窗
      //   下拉选项
      supportOptions, leakTypeOptions, filterOptions, paymentOptions, positiveOptions,
      //   表头
      isFields: [
        {
          key: "radio", label: "", tdClass: (a, b, c) => {
            if (c.id == this.selectedInfo.id) {
              return "selectRow";
            }
          },
        },
        {
          key: "icon", label: "图标", tdClass: (a, b, c) => {
            if (c.id == this.selectedInfo.id) {
              return "selectRow";
            }
          },
        },
        {
          key: "name", label: "软件名称", tdClass: (a, b, c) => {
            if (c.id == this.selectedInfo.id) {
              return "selectRow";
            }
          },
        },
        {
          key: "friendly", label: "发布者名称", tdClass: (a, b, c) => {
            if (c.id == this.selectedInfo.id) {
              return "selectRow";
            }
          },
        },
        {
          key: "payment_type", label: "付费类型", tdClass: (a, b, c) => {
            if (c.id == this.selectedInfo.id) {
              return "selectRow";
            }
          },
        },
        {
          key: "positive_level", label: "级别", tdClass: (a, b, c) => {
            if (c.id == this.selectedInfo.id) {
              return "selectRow";
            }
          },
        },
        {
          key: "support_des", label: "透明加解密", tdClass: (a, b, c) => {
            if (c.id == this.selectedInfo.id) {
              return "selectRow";
            }
          },
        },
      ],
      isItems: [],
      page: 1,
      size: 10,
      count: 0,
      searchVal: '',
      number: '',
      pageNum: '',
      // 图标颜色
      variantEnum: {
        0: "light-danger",
        1: "light-success",
      },
      // 图标颜色
      variantPayment: {
        1: "light-success",
        2: "light-danger",
        3: "light-warning",
        4: "light-info",
      },
    }
  },
  mounted() {
    this.getProcessMsg()
  },
  methods: {
    async submit(flag) {
      if (flag == 0) {
        const params = JSON.parse(JSON.stringify({ ...this.process }))
        params.software_id = this.selected.id
        params.software_name = this.selected.name;
        try {
          const { data } = await updateProcess(params);
          if (data == true) {
            toast('CheckIcon', 'success', '提交成功！');
            this.$router.back()
          }
          console.log(data, 'datas');
        } catch (error) {
          toast("XCircleIcon", "danger", error)
        }
      } else {
        this.$router.back()
      }
    },
    isButton(flag) {
      if (flag == 0) {
        this.selected = this.selectedInfo;
      } else {
        this.isModal = false;
      }
      this.isModal = false
    },
    // 获取列表信息
    async getSoftwareRule() {
      this.show = true
      try {
        const { data } = await softwareRule({
          size: this.size,
          page: this.page,
          keywords: this.searchVal,
        })
        this.isItems = data.data;
        this.count = data.count;
        this.isItems.forEach(async (e) => {
          const { data } = await softwareIcon({
            id: e.id
          });
          this.$set(e, 'icon', data)
        })
      } catch (error) {

      }
      this.show = false
    },
    showTable() {
      this.isModal = true;
      this.getSoftwareRule()
    },
    async getProcessMsg() {
      const { data } = await processMsg({
        name: this.name, company: this.company, description: this.description, product_name: this.product_name
      })
      this.process = data.process;
      this.selectedInfo = this.selected = data.software || {}
    },
    // 切换下一页
    changePage(e) {
      this.page = e
      this.getSoftwareRule();
    },
    // 跳页
    goPage() {
      this.page = this.pageNum;
      this.getSoftwareRule();
    },
    // 点击选中
    onRowSelected(items) {
      if (items.length) {
        this.selectedInfo = items[0];
      }
    },
    // 回显数据
    findLabel(params, id) {
      let items = [];
      params.forEach((e) => {
        if (e.id === id) {
          items.push(e.name)
        }
      })
      return items.toString()
    },
    // 搜索
    search() {
      this.page = 1
      this.getSoftwareRule()
    }
  },
}
</script>

<style lang="less" scoped>
/deep/.form {
  .col-form-label {
    width: 9rem;
  }
}
</style>

<style lang="less">
.modal-xl {
  max-width: 80rem;
}
.bodyClass {
  padding: 0;
}
</style>