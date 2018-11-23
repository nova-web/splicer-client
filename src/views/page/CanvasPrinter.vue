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
      <canvas ref="canvas" @dblclick="dblclick" @mousemove="mouseMoveCanvas" @mousedown="mousedownCanvas" @mouseup="mouseupCanvas" @click="createDraw"></canvas>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        canvasData: [],  // 存储每个canvas对象的坐标
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
    watch: {

    },
    mounted() {
      this.canvas.c = this.$refs.canvas;
      console.log(window.innerWidth, window.innerHeight);

      // canvas width: 100%
      // if(this.canvas.c.width < window.innerWidth) {
      //   this.canvas.c.width = window.innerWidth;
      // }

      // if(this.canvas.c.height < window.innerHeight) {
      //   this.canvas.c.height = window.innerHeight;
      // }

      this.canvas.ctx = this.canvas.c.getContext('2d');
      this.canvas.ctx.clearRect(10, 10, 130, 130); // 擦除(0,0)位置大小为200x200的矩形，擦除的意思是把该区域变为透明
      this.canvas.ctx.fillStyle = '#dddddd'; // 设置颜色
      this.canvas.ctx.fillRect(10, 10, 130, 130); // 把(10,10)位置大小为130x130的矩形涂色

      // 存储数据
      this.canvasData[0] = { x: 10, y: 10, w: 130, h: 130, color: '#ddd', isDone: false };
    },
    created() {
      // this.draw();
    },
    methods: {
      // ---------- 业务 -----------
      // 事件
      dblclick() {
      },
      mouseMoveCanvas(event) {
        this.x.value = event.offsetX;
        this.y.value = event.offsetY;
        if(this.isInArea(event.offsetX, event.offsetY, this.canvasData[0])) {
          this.canvas.c.style.cursor = 'move';
          if(this.canvasData[0].isDown) {
            var X = event.layerX - this.canvasData[0].w / 2;
            var Y = event.layerY - this.canvasData[0].h / 2;
            this.draw(X, Y, this.canvasData[0].w, this.canvasData[0].h, this.canvasData[0].color);
          }
        } else {
          this.canvas.c.style.cursor = 'default';
        }
      },
      mousedownCanvas(event) {
        let X = event.layerX;
        let Y = event.layerY;
        if(X < this.canvasData[0].x + this.canvasData[0].w && X > this.canvasData[0].x) {
          if(Y < this.canvasData[0].y + this.canvasData[0].h && Y > this.canvasData[0].y) {
            this.canvasData[0].isDown = true;
          }
        } else {
          this.canvasData[0].isDown = false;
        }
      },
      mouseupCanvas(event) {
        this.canvasData[0].isDown = false
      },
      createDraw(event) {
        // 在区域里，则移动
        if(this.isInArea(event.offsetX, event.offsetY, this.canvasData[0])) {
          // 重绘

        }
        // 不在区域里，则新建
        if(!this.isInArea(event.offsetX, event.offsetY, this.canvasData[0])) {
          console.log('新建');
        }
      },

      // ---------- 功能 -----------
      draw(x, y, w, h, color) {
        console.log(111, this.canvas.ctx);
        // this.$nextTick(() => {
        this.canvas.ctx.clearRect(this.canvasData[0].x, this.canvasData[0].y, this.canvasData[0].w, this.canvasData[0].h);
        this.canvasData[0].x = x
        this.canvasData[0].y = y
        this.canvasData[0].w = w
        this.canvasData[0].h = h
        this.canvasData[0].color = color
        this.canvas.ctx.fillStyle = this.canvasData[0].color
        this.canvas.ctx.fillRect(this.canvasData[0].x, this.canvasData[0].y, this.canvasData[0].w, this.canvasData[0].h);
        // });
      },
      // util
      isInArea(x, y, obj) {
        if(x < obj.x || x > obj.x + obj.w) {
          return false;
        }
        if(y < obj.y || y > obj.y + obj.h) {
          return false;
        }
        return true;
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
        // height: 100%;
        // width: 100%;
        background-color: burlywood;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
</style>
