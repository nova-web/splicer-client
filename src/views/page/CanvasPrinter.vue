<template>
  <div class="slider-box">
    <div class="box-top">
      <div class="slider-rows">
        <span class="demonstration">x</span>
        <el-input-number v-model="x.value" @change="changeX" :min="x.min" :max="x.max" label="x" controls-position="right"></el-input-number>
      </div>
      <div class="slider-rows">
        <span class="demonstration">y</span>
        <el-input-number v-model="y.value" @change="changeY" :min="y.min" :max="y.max" label="y" controls-position="right"></el-input-number>
      </div>
      <div class="slider-rows">
        <span class="demonstration">w</span>
        <el-input-number v-model="width.value" @change="changeW" :min="width.min" :max="width.max" label="w" controls-position="right"></el-input-number>
      </div>
      <div class="slider-rows">
        <span class="demonstration">h</span>
        <el-input-number v-model="height.value" @change="changeH" :min="height.min" :max="height.max" label="h" controls-position="right"></el-input-number>
      </div>
    </div>
    <div class="box-bottom">
      <canvas ref="canvas" :style="{width: canvas.w + 'px', height: canvas.h + 'px', left: canvas.x + 'px', top: canvas.y + 'px'}"></canvas>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        canvasData: null,
        limit: {
          min: 50,
          max: 700
        },
        canvas: {
          c: null,
          ctx: null,
          x: 0,
          y: 0,
          w: 0,
          h: 0
        },
        x: {
          value: 0,
          min: 0,
          max: 700
        },
        y: {
          value: 0,
          min: 0,
          max: 700
        },
        width: {
          value: 0,
          min: 0,
          max: 700
        },
        height: {
          value: 0,
          min: 0,
          max: 700
        }
      }
    },
    components: {
    },
    computed: {
    },
    mounted() {
      this.canvas.c = this.$refs.canvas;
      this.canvas.ctx = this.canvas.c.getContext('2d');
      this.canvas.ctx.clearRect(0, 0, 200, 200); // 擦除(0,0)位置大小为200x200的矩形，擦除的意思是把该区域变为透明
      this.canvas.ctx.fillStyle = '#dddddd'; // 设置颜色
      this.canvas.ctx.fillRect(10, 10, 130, 130); // 把(10,10)位置大小为130x130的矩形涂色
      // 利用Path绘制复杂路径:
      var path = new Path2D();
      path.arc(75, 75, 50, 0, Math.PI * 2, true);
      path.moveTo(110, 75);
      path.arc(75, 75, 35, 0, Math.PI, false);
      path.moveTo(65, 65);
      path.arc(60, 65, 5, 0, Math.PI * 2, true);
      path.moveTo(95, 65);
      path.arc(90, 65, 5, 0, Math.PI * 2, true);
      this.canvas.ctx.strokeStyle = '#0000ff';
      this.canvas.ctx.stroke(path);
    },
    created() {
      this.printCanvas();
    },
    methods: {
      draw() {
        this.initCanvas();
        this.printCanvas();
      },
      initCanvas() {
        console.log('initCanvas', this.canvas.c);
        this.canvas.c.width = 500;
        this.canvas.c.height = 500;

        // 和input框关联
        this.width.value = this.canvas.c.width;
        this.width.min = this.limit.min;
        this.width.max = this.limit.max;
        this.height.value = this.canvas.c.height;
        this.height.min = this.limit.min;
        this.height.max = this.limit.max;
        this.x.value = 0;
        this.x.min = 0;
        this.x.max = this.limit.max;
        this.y.value = 0;
        this.y.min = 0;
        this.y.max = this.limit.max;
      },
      // 绘制
      printCanvas() {
        console.log(this.canvas.ctx);
      },
      changeX() {

      },
      changeY() {

      },
      changeW() {

      },
      changeH() {

      }
    }
  }


</script>

<style scoped lang="less">
  .slider-box {
    width: 100%;
    height: 100%;
    .box-top {
      display: flex;
      width: 100%;
      height: 60px;
      .slider-rows {
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        display: flex;
        .demonstration {
          width: 120px;
          height: 32px;
          margin-right: 20px;
          line-height: 32px;
          text-align: right;
          color: #999;
          font-size: 14px;
        }
      }
    }
    .box-bottom {
      width: 100%;
      height: 700px;
      background-color: #c2e9fa;
      position: relative;
      > canvas {
        // background-color: transparent;
        background-color: burlywood;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
</style>
