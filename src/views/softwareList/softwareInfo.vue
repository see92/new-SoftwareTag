<template>
  <b-card no-body>
    <b-overlay :show="show">
      <!-- 头部 -->
      <div class="d-flex mt-2 ml-2">
        <feather-icon icon="ClipboardIcon" size="19" class="mr-50" />
        <h4>{{ msg }}</h4>
      </div>
      <!-- 内容 -->
      <div class="mt-1">
        <ValidationObserver ref="loginForm" #default="{invalid}">
          <b-form class="form" @submit.prevent="isSubmit" autocomplete="off">
            <!-- 上传图标 -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="上传图标：" label-for="uploadIcon" label-cols-md="auto">
                  <b-form-file placeholder="请上传软件图标" drop-placeholder="上传" class="w34" />
                </b-form-group>
              </b-col>
            </b-row>
            <!-- 软件名称 -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="软件名称：" label-for="softwareName" label-cols-md="auto">
                  <ValidationProvider name="softwareName" rules="required" #default="{errors}">
                    <b-form-input class="w34" :state="errors.length>0?false:null" placeholder="请输入软件名称" v-model="software.name" />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- 软件描述 -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="软件描述：" label-for="softwareDes" label-cols-md="auto">
                  <b-form-input class="w34" placeholder="请输入软件描述" v-model="software.description" />
                </b-form-group>
              </b-col>
            </b-row>
            <!-- 软件类型 -->
            <b-row align-h="center">
              <b-col cols="5">
                <ValidationProvider name="softwareType" rules="required" #default="{errors}">
                  <b-form-group label="软件类型：" label-for="type" label-cols-md="auto">
                    <v-select :searchable="false" :clearable="false" :state="errors.length > 0 ? false : null" :reduce="(label) => label.key" class="w34" v-model="software.type_dic_id" placeholder="请选择软件类型" />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </b-form-group>
                </ValidationProvider>
              </b-col>
            </b-row>
            <!-- 软件标签 -->
            <b-row align-h="center">
              <b-col cols="5">
                <ValidationProvider name="softwareTag" rules="required" #default="{errors}">
                  <b-form-group label="软件标签" label-for="softwareTag" label-cols-md="auto">
                    <v-select :searchable="false" :clearable="false" :state="errors.length>0?false:null" :reduce="(label) => label.key" class="w34" v-model="software.tags_dic_id" placeholder="请选择软件标签" />
                    <small class="text-danger"> {{ errors[0] }} </small>
                  </b-form-group>
                </ValidationProvider>
              </b-col>
            </b-row>
            <!-- 匹配规则 -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="匹配规则：" label-for="rules" label-cols-md="auto">
                  <ValidationProvider name="softwareRules" rules="required" #default="{errors}">
                    <b-form-input :state="errors.length > 0 ? false :null" placeholder="请输入软件名称匹配规则" class="w34" v-model="software.name_match_rule" />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- 发布者名称(未完成) -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="发布者名称：" label-for="publisherName" label-cols-md="auto">
                  <el-autocomplete class="w34" placeholder="请选择发布者名称" popper-class="my-autocomplete">
                  </el-autocomplete>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- 付费类型 -->
            <Select label="付费类型：" veeName="payType" placeholder="请选择付费类型" :options="payOptions" :value.sync="software.payment_type" />
            <!-- 积极消极级别： -->
            <Select label="积极消极级别：" veeName="level" placeholder="请选择积极消极级别" :options="lvOptions" :value.sync="software.positive_level" />
            <!-- 过滤流量： -->
            <Select label="过滤流量：" veeName="filterFlow" placeholder="请选择过滤流量" :options="flowOptions" :value.sync="software.filter_traffic" />
            <!-- 泄密类型： -->
            <Select label="泄密类型：" veeName="leakType" placeholder="请选择泄密类型" :options="leakTypeOptions" :value.sync="software.leak_type" />
            <!-- 泄密加密 -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="透明加密：" label-for="support_des" label-cols-md="auto">
                  <b-form-radio-group style="margin-top: 8px;" plain v-model="software.support_des" :options="supportOptions"></b-form-radio-group>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- 爬虫网址 -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="爬虫网址：" label-for="reptile_url" label-cols-md="auto">
                  <ValidationProvider name="reptileUrl" rules="required" #default="{errors}">
                    <b-form-input class="w34" placeholder="请输入软件地址" v-model="software.reptile_url" :state="errors.length>0?false:null" />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>
            </b-row>
            <hr />
            <div class="d-flex ">
              <b-button variant="primary" class="mr-1">保存</b-button>
              <b-button variant="outline-primary">取消</b-button>
            </div>
          </b-form>
        </ValidationObserver>
      </div>
    </b-overlay>
  </b-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from "@validations";
import { payOptions, lvOptions, flowOptions, leakTypeOptions, supportOptions } from "./js/options";
export default {
  name: 'softwareInfo',
  components: { ValidationProvider, ValidationObserver },
  data() {
    return {
      show: false,
      msg: '添加软件',
      software: {
        name: '', //软件名称
        description: '',  //软件描述
        type_dic_id: '',  //软件类型
        tags_dic_id: '',  //软件标签
        name_match_rule: '',  //匹配规则
        payment_type: null,  //付费类型
        positive_level: null, //积极消极级别
        filter_traffic: null, //过滤流量
        leak_type: null,  //泄密类型
        support_des: 1, //透明加密
        reptile_url: '' //爬虫网址
      },
      //   校验规则
      required,
      // 下拉选项信息
      payOptions,
      lvOptions,
      flowOptions,
      leakTypeOptions,
      supportOptions
    }
  },
}
</script>

<style lang="less" scoped>
.w34 {
  width: 34.375rem;
  max-width: 34.375rem;
}
/deep/.form {
  .col-form-label {
    width: 8.125rem;
  }
}
</style>

<style>
.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: "浏览";
}
</style>