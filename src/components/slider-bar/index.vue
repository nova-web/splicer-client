<template>
  <div class="slider">
    <el-slider class="fp-slider" :step="step" :min="min" :max="max" v-model="value" @change="change" :disabled="disabled"></el-slider>
    <div class="slider-input" v-if="showinput">
      <el-input-number v-model="value" controls-position="right" :step="step" :min="min" :max="max" @change="inputChange"></el-input-number>
    </div>
  </div>
</template>

<script>
  import { serialize } from '@/utils';
  export default {
    props: {
      val: {
        type: Number,
        default: 0
      },
      step: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: 100
      },
      min: {
        type: Number,
        default: 0
      },
      showinput: {
        default: false,
        type: Boolean
      },
      islock: {
        default: false,
        type: Boolean
      },
      disabled: {
        default: false,
        type: Boolean
      }
    },
    data() {
      return {
        value: 0,
        count: 0,
        drag: true // 防止通过props 改变而下发
      };
    },
    watch: {
      value: function(newVal) {
        if(this.count && this.drag) {
          if(!this.islock) {
            this.$emit('callback', newVal);
          }
        } else {
          this.drag = true;
        }
        this.count++;
      },
      val: function(newVal) {
        if(this.value !== newVal) {
          this.value = newVal;
        }
        this.drag = false;
      }
    },
    created() {
      this.value = this.val;
    },
    methods: {
      change(val) {
        this.$emit('change', val);
      },
      inputChange(val) {
        if(!this.islock) {
          this.$emit('callback', val);
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .slider {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    .fp-slider {
      flex: 1;
      margin-right: 20px;
    }
    .slider-input {
      width: 80px;
      height: 30px;
      border-radius: 4px;
    }
  }
</style>
