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
          <b-form class="form" @submit.prevent="handle_pre" autocomplete="off">
            <!-- 上报软件名称 -->
            <b-row align-h="center" v-if="mark">
              <b-col cols="5">
                <b-form-group label="上报软件名称：" label-for="softwareName" label-cols-md="auto">
                  <b-form-input class="w34" :value="softwareName" disabled />
                </b-form-group>
              </b-col>
            </b-row>
            <!-- 上报发布者名称 -->
            <b-row align-h="center" v-if="mark">
              <b-col cols="5">
                <b-form-group label="上报发布者名称：" label-for="pubName" label-cols-md="auto">
                  <b-form-input :value="pubName" disabled class="w34" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row align-h="center" v-if="mark">
              <b-col cols="5">
                <b-form-group label="选择图标" label-for="icon" label-cols-md="auto">
                  <b-button variant="primary" @click="showModal">选择图标</b-button>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- 预览图片 -->
            <b-row align-h="center" v-if="software.icon">
              <b-col cols="5">
                <b-form-group label="" label-for="icon" label-cols-md="auto">
                  <img :src="`data:image/jpg;base64,${software.icon}`" style="width:65px;height:65px">
                </b-form-group>
              </b-col>
            </b-row>
            <!-- 上传图标 -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="上传图标：" label-for="uploadIcon" label-cols-md="auto">
                  <b-form-file placeholder="请上传软件图标" drop-placeholder="上传" class="w34" @change="getBase64" />
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
                    <v-select :searchable="false" :clearable="false" :state="errors.length > 0 ? false : null" :reduce="(name) => name.id" label="name" class="w34" v-model="software.type_dic_id" placeholder="请选择软件类型" :options="typeOptions" />
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
                    <v-select :searchable="false" :clearable="false" :state="errors.length>0?false:null" :close-on-select="false" :reduce="(name) => name.id" class="w34" v-model="software.tags_dic_id" placeholder="请选择软件标签" :options="tagOptions" label="name" multiple @select="handleSelect" />
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
            <!-- 发布者名称 -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="发布者名称：" label-for="pubName" label-cols-md="auto">
                  <el-autocomplete popper-class="my-autocomplete" value-key="name" v-model="state" class="w34" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" @input="searchPub">
                    <el-button slot="append" icon="el-icon-plus" @click="handlePubName" />
                    <template slot-scope="{item}">
                      <div class="name d-flex justify-content-between">
                        <div class="Style" style="width:200px">
                          {{ item.name }}
                        </div>
                        <div>
                          <i style="margin-right: 15px; font-size: 16px;" class="el-icon-edit" @click.stop="elButton(0,item)" />
                          <i class="el-icon-delete" @click.stop="elButton(1,item)" />
                        </div>
                      </div>
                      <div class="url"><span>网址：</span>{{ item.url }}</div>
                      <div class="friendly"><span>友好名称：</span>{{ item.friendly }}</div>
                      <div class="rule"><span>规则：</span>{{ item.rule }}</div>
                    </template>
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
            <Select label="透明加密：" veeName="support" :options="supportOptions" :value.sync="software.support_des" />
            <!-- 爬虫网址 -->
            <b-row align-h="center">
              <b-col cols="5">
                <b-form-group label="爬虫网址：" label-for="reptile_url" label-cols-md="auto">
                  <b-form-input class="w34" placeholder="请输入软件地址" v-model="software.reptile_url" />
                </b-form-group>
              </b-col>
            </b-row>
            <hr />
            <div class="d-flex justify-content-center ">
              <b-button :disabled="invalid" type="submit  " variant="primary" class="mr-1">保存</b-button>
              <b-button variant="outline-primary" @click="goBack">取消</b-button>
            </div>
          </b-form>
        </ValidationObserver>
      </div>

      <!-- 弹窗效果 -->
      <b-modal v-model="isModal" no-close-on-backdrop hide-footer centered body-class="bodyClass" content-class="contentClass">
        <b-form autocomplete="off">
          <div class="pl-1 pr-1 mt-1">
            <b-form-group label='发布者名称：' label-cols-md="3" label-for="name">
              <b-form-input placeholder="请输入发布者名称" v-model="publisher.name" />
            </b-form-group>
            <b-form-group label="发布者网址：" label-cols-md="3" label-for="url">
              <b-form-input placeholder="请输入发布者网址" v-model="publisher.url" />
            </b-form-group>
            <b-form-group label="发布者友好名称：" label-cols-md="3" label-for="friendName">
              <b-form-input placeholder="请输入发布者友好名称" v-model="publisher.friendly" />
            </b-form-group>
            <b-form-group label="发布者规则：" label-cols-md="3" label-for="rule">
              <b-form-input placeholder="请输入发布者规则" v-model="publisher.rule" />
            </b-form-group>
          </div>
          <hr />
          <div class="mb-1 mr-1 d-flex justify-content-end ">
            <b-button class="mr-1" variant="primary" @click="isButton(0)">确定</b-button>
            <b-button variant="outline-primary" @click="isButton(1)">取消</b-button>
          </div>
        </b-form>
      </b-modal>
      <!-- 删除提示 -->
      <b-modal v-model="delModal" hide-footer centered no-close-on-backdrop size="sm" title="提示：">
        <div class="d-flex justify-content-center">此操作将会删除数据，是否继续？</div>
        <div class="d-flex mt-1 justify-content-end">
          <b-button variant="danger" class="mr-1" @click="del_button(0)">确定</b-button>
          <b-button variant="outline-danger" @click="del_button(1)">取消</b-button>
        </div>
      </b-modal>

      <!-- 选择图标列表 -->
      <b-modal title="请选择图标" v-model="showImg" hide-footer centered>
        <div v-if="IconList.length == 0" class="d-flex justify-content-center" style="margin:15px 0 -20px 0">
          <span style="font-weight:600">当前暂无图标可进行选择</span>
        </div>
        <div style="padding:20px;overflow: auto; max-height: 357px;">
          <div v-for="(item,index) in IconList" @click="handle_pic(item,index)" style="width:130px;float: left; " :class="{'borderT':isTrue == item.fingerprint}" class="borderF">
            <div>
              <img :src=" `data:image/jpg;base64,${item.icon}`" class="wh">
            </div>
          </div>
        </div>
        <div class="btn d-flex justify-content-end">
          <b-button variant="primary" class="mr-1" @click="showClick(0)">确定</b-button>
          <b-button variant="outline-primary" @click="showClick(1)">取消</b-button>
        </div>
      </b-modal>
    </b-overlay>

  </b-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { toast } from "@/assets/js/toast";
import { required } from "@validations";
import { dicClassify, dicTag, publisherList, AddPublisher, updatePublisher, delPublisher, insertSoftware, softwareInfo, updateSoftware, iconList, Check_matchrule } from "./js/api";
import { payOptions, lvOptions, flowOptions, leakTypeOptions, supportOptions } from "./js/options";
export default {
  name: 'softwareInfo',
  components: { ValidationProvider, ValidationObserver },
  data() {
    return {
      id: this.$route.query.id,
      flag: this.$route.query.flag,
      softwareName: this.$route.query.softwareName,
      pubName: this.$route.query.pubName,
      mark: this.$route.query.mark,
      show: false,
      msg: '添加软件',
      software: {
        name: '', //软件名称
        description: '',  //软件描述
        icon: '',   //图标
        type_dic_id: '',  //软件类型
        tags_dic_id: [],  //软件标签
        name_match_rule: '',  //匹配规则
        payment_type: null,  //付费类型
        positive_level: null, //积极消极级别
        filter_traffic: null, //过滤流量
        leak_type: null,  //泄密类型
        support_des: 1, //透明加密
        reptile_url: '', //爬虫网址
        icon_fingerprint: ''  //icon图标指纹
      },
      publisher: {  //发布者信息
        name: '',
        url: '',
        friendly: '',
        rule: ''
      },
      //   校验规则
      required,
      // 下拉选项信息
      payOptions,
      lvOptions,
      flowOptions,
      leakTypeOptions,
      supportOptions,
      typeOptions: [],  //软件类型
      tagOptions: [],  //软件标签
      state: '',  //发布者名称输入框中显示的名称
      publisherInfo: [],  //发布者列表
      isModal: false, //编辑发布者信息
      items: {},  //存单条发布者信息使用的items
      delModal: false,  //发布者删除弹窗
      isTrue: null,
      isIcon: '',
      isImg: '',
      showImg: false,
      IconList: []
    }
  },
  methods: {
    // 展示选择图标确定取消按钮事件
    showClick(index) {
      if (this.IconList != 0) {
        if (index == 0) {
          // return
          if (this.isIcon == '' && this.software.icon == '') {
            this.$swal.fire({
              icon: 'error',
              text: '请选择一个图标'
            })
          } else if (this.isIcon != '') {
            this.isImg = this.isIcon
            this.software.icon_fingerprint = this.isTrue
            this.software.icon = this.isIcon
            this.showImg = false
          }
        } else {
          this.showImg = false;
        }
      } else {
        this.showImg = false
      }
    },
    showModal() {
      this.getIconList()
      if (this.software.icon_fingerprint) {
        this.showImg = true
        this.isTrue = this.software.icon_fingerprint;
        this.isIcon = this.software.icon
      } else {
        [this.showImg, this.isTrue, this.isIcon] = [true, null, '']
      }
    },
    // 获取图标列表
    async getIconList() {
      try {
        const { data } = await iconList({
          software_id: this.query.id
        });
        this.IconList = data.map((k) => {
          k.state = false;
          return k
        });
      }
      catch (error) {
      }

    },
    // 回显数据
    async getsoftwareInfo() {
      try {
        const { data } = await softwareInfo({
          id: this.id
        });
        this.software = data.software;
        console.log('this.software', this.software);
        // 回显发布者信息
        this.items.id = data.software.publisher_id;
        const pubName = this.publisherInfo.find((e) => e.id == data.software.publisher_id);
        this.state = pubName == undefined ? '' : pubName.name;
        this.publisherInfo = pubName == undefined ? this.publisherInfo : [pubName];
        // 回显软件标签
        const newData = []
        data.software_tags.map((e) => {
          const a = this.tagOptions.find((k) => k.id == e.tags_dic_id);
          newData.push(a.id)
        })
        this.software.tags_dic_id = newData
      } catch (error) { }
    },
    // 添加发布者按钮
    async isButton(flag) {
      const params = JSON.parse(JSON.stringify({ ...this.publisher }));
      if (flag == 0) {
        if (!params.id) {
          try {
            const { status } = await AddPublisher(params)
            if (status == 200) {
              toast("CheckIcon", 'success', '提交成功！')
            }
          } catch (error) {
            toast("XCircleIcon", "danger", error)
          }
        } else {
          try {
            const { status } = await updatePublisher(params);
            if (status == 200) {
              toast('CheckIcon', 'success', '修改成功！')
            }
          } catch (error) {
            toast("XCircleIcon", "danger", error)
          }
        }
      } else if (flag == 1) {
        this.isModal = false;
      }
      this.getPublisher()
      this.isModal = false;
    },
    // 上传图标信息
    getBase64(e) {
      let file = e.target.files[0];
      if (window.FileReader) {
        let reader = new FileReader()
        reader.readAsDataURL(file);
        // console.log('reader:', reader);
        reader.onload = (e) => {
          let base64String = e.target.result;
          this.software.icon = base64String.split(',')[1];
          this.software.icon_fingerprint = null
          // console.log('eeeeeee:', this.software.icon);
          //   this.base64String = base64String.split(',')[1];
          //   this.software.icon = this.base64String;
          //   this.isImg = this.software.icon;
          //   this.software.icon_fingerprint = null
        };
      }
    },
    // 添加信息
    handle_pre() {
      this.$refs.loginForm.validate().then((success) => {
        if (success) this.changeAdd()
      })
    },  
    async changeAdd() {
      if (this.mark) {
        const newData = await Check_matchrule(
          this.software.name_match_rule,
          this.softwareName
        )
        if (newData.data === false) {
          toast("XCircleIcon", "danger", '规则匹配失败');
          return
        }
      }
      const params = JSON.parse(JSON.stringify({ ...this.software }))
      params.publisher_id = this.items.id
      if (this.id) {
        console.log(params);
        // return
        try {
          params.id = this.id;
          const { data } = await updateSoftware(params)
          if (data == true) {
            toast('CheckIcon', 'success', '提交成功！')
            this.$router.back()
          }
        } catch (error) {
          toast("XCircleIcon", "danger", error);
          return
        }
      } else {
        try {
          const { data } = await insertSoftware(params);
          if (data == true) {
            toast('CheckIcon', 'success', '提交成功！')
            this.$router.back()
          }
        } catch (error) {
          toast("XCircleIcon", "danger", error);
          return
        }
      }
    },
    // 获取软件类型
    async getDicClassify() {
      this.show = true
      try {
        const { data } = await dicClassify()
        this.typeOptions = data.filter((e) => e.parent_id != 0);
      } catch (error) {
        toast("XCircleIcon", "danger", error)
      }
      this.show = false
    },
    // 获取标签分类
    async getDicTags() {
      const { data } = await dicTag()
      this.tagOptions = data.filter((e) => e.parent_id != 0)
    },

    // 获取发布者信息
    async getPublisher() {
      const { status, data } = await publisherList();
      if (status == 200) {
        this.publisherInfo = data
      }
    },

    // 输入查询信息
    async searchPub() {
      const { data } = await publisherList()
      this.publisherInfo = data
    },
    querySearch(queryString, cb) {
      var restaurants = this.publisherInfo;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      this.items = item
    },
    // 点击el-button  清空内容
    handlePubName() {
      this.isModal = true
      this.publisher = {}   //每次点击
    },
    // 预备删除操作
    elButton(flag, item) {
      // 0：修改  1：删除
      if (flag == 0) {
        this.isModal = true
        this.publisher = item
      } else if (flag == 1) {
        this.delId = item.id
        this.delModal = true
      }
    },
    // 最终删除信息操作
    async del_button(flag) {
      // 0：确定  1：取消
      if (flag == 0) {
        try {
          const { data } = await delPublisher({ id: this.delId });
          if (data == 1) {
            toast("CheckIcon", 'success', '删除数据成功！')
            this.getPublisher()
          }
        } catch (error) {
          toast("XCircleIcon", 'danger', error)
        }
        this.delModal = false
      } else if (flag == 1) {
        this.delModal = false
      }

    },
    // 返回
    goBack() {
      this.$router.back()
    }
  },
  async mounted() {
    await this.getPublisher();
    await this.getDicClassify()
    await this.getDicTags()
    this.restaurants = this.publisherInfo
    if (this.flag == 1) {
      this.msg = '修改软件',
        await this.getsoftwareInfo()
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
    width: 9rem;
  }
}

.my-autocomplete {
  // z-index: 1;
  li {
    line-height: normal;
    padding: 7px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .url,
    .friendly,
    .rule {
      font-size: 12px;
      color: rgb(161, 161, 161);
      line-height: 23px;
    }
    .highlighted .url {
      color: #ddd;
    }
    div:last-child {
      margin-bottom: 8px;
    }
  }
}
.Style {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>


<style lang="less">
.contentClass {
  width: 660px;
  .modal-body {
    width: 660px !important;
  }
}
.my-autocomplete {
  z-index: 1;
}
.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: "浏览";
}

.bodyClass {
  z-index: 999999999;
  width: 660px !important;
  padding: 0;
}

.el-autocomplete-suggestion {
  z-index: 1 !important;
}
</style>