<template>
  <b-row align-h="center">
    <b-col cols="5">
      <ValidationProvider :name="veeName" rules="required" #default="{errors}">
        <b-form-group :label="label" :label-for="label" label-cols-md="auto" :state="errors.length>0 ?false:null">
          <v-select class="w34" :options="options" :clearable="false" :searchable=false :placeholder="placeholder" :reduce="(name) => name.id" @input="input" v-model="id" label="name" />
          <small class="text-danger">{{ errors[0] }}</small>
        </b-form-group>
      </ValidationProvider>

    </b-col>
  </b-row>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import { required } from "@validations";
export default {
  name: 'Select',
  components: {
    ValidationProvider
  },
  props: {
    value: { type: Number, default: '' },
    label: { type: String, default: '' },
    veeName: { type: String, default: '' },
    options: { type: Array, default: '' },
    placeholder: { type: String, default: '' }
  },
  data() {
    return {
      id: '',
      // 声明校验规则
      required,
    }
  },
  mounted() {
    this.id = this.$props.value
  },
  methods: {
    input() {
      this.$emit("update:value", this.id)
    }
  },
  watch: {
    value(newValue) {
      this.id = newValue
    }
  }
}
</script>

<style lang="less" scoped>
.w34 {
  width: 34.375rem;
  max-width: 34.375rem;
}
</style>