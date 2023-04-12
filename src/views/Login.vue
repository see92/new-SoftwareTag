<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <vuexy-logo />

          <h2 class="brand-text text-primary ml-1">
            标注系统
          </h2>
        </b-link>

        <!-- form -->
        <validation-observer ref="loginForm" #default="{invalid}">
          <b-form class="auth-login-form mt-2" @submit.prevent="login">

            <!-- 手机号码 -->
            <b-form-group label-for="phone" label="手机号码">
              <validation-provider name="phone" rules="required|phone" #default="{errors}">
                <b-form-input v-model="phone" :state="errors.length>0?false:null" placeholder="请输入手机号码" />
                <small class="text-danger">{{ errors[0] }} </small>
              </validation-provider>
            </b-form-group>

            <!-- 验证码 -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">验证码</label>

              </div>
              <div class="d-flex justify-content-between">
                <div style="width:100%">
                  <b-form>
                    <validation-provider name="code" rules="required|code" #default="{errors}">
                      <b-form-input placeholder="请输入验证码" v-model="code" :state="errors.length>0?false:null" />
                      <small class="text-danger"> {{errors[0]}}</small>
                    </validation-provider>
                  </b-form>
                </div>
                <div>
                  <b-button :disabled="isDisabled" variant="primary" class="ml-1" style="width:8.5rem" @click="getCode">{{msg}}</b-button>
                </div>
              </div>
            </b-form-group>

            <b-button variant="primary" type="submit" block :disabled="invalid">
              登录
            </b-button>
          </b-form>
        </validation-observer>

      </b-card>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { smsCode, tokenInfo, userInfo } from "./api";
import VuexyLogo from '@core/layouts/components/Logo.vue'
import { required, email, phone } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { toast } from "@/assets/js/toast";
export default {
  components: {
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      userEmail: '',
      phone: '',  //手机号码
      code: '', //验证码
      password: '',
      status: '',
      msg: '获取验证码',
      isDisabled: false,  //禁用按钮
      timer: null,
      codeTime: 60,
      // validation rules
      required,
      email,
      phone
    }
  },
  methods: {
    // 获取验证码
    async getCode() {
      const phoneReg = /^1[3456789]\d{9}$/;
      if (phoneReg.test(this.phone)) {
        try {
          const { status, data } = await smsCode({
            phone: this.phone
          });
          if (status == 200) {
            toast("CheckIcon", "success", data);
            this.isDisabled = true;
            this.timer = setInterval(() => {
              if (this.codeTime > 0 && this.codeTime <= 60) {
                this.codeTime--;
                if (this.codeTime !== 0) {
                  this.msg = `剩余${this.codeTime}秒`
                } else {
                  clearInterval(this.timer)
                  this.msg = '获取验证码';
                  this.timer = null;
                  this.codeTime = 60
                  this.isDisabled = false
                }
              }
            }, 1000)
          } else {
            toast("XCircleIcon", "danger", data)
          }
        } catch (error) {
          console.log('error:', error);
          toast("XCircleIcon", "danger", error)
        }
      }
    },
    async login() {
      try {
        const { data } = await tokenInfo({
          phone: this.phone,
          code: this.code
        })
        if (data && data.token) {
          window.localStorage.setItem("accessToken", data.token);
          const res = await userInfo();
          if (res.status == 200) {
            let newData = JSON.stringify(res.data)
            window.localStorage.setItem("userInfo", newData)
          }
          this.$router.push({
            path: '/'
          })
        }
      } catch (error) {
        console.log('error:', error);
      }
    }
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
