<template>
  <!-- 使用canvas -->
  <div class="socket">
    <canvas id="canvas" width="800" height="800"></canvas>
    <!-- <video :src="getImgData.video" controls="controls"></video>
    <img :src="getImgData.src" alt=""> -->
  </div>
</template>

<script>
  export default {
    name: 'socketio-canvas',
    sockets: {
      connect: function(data) {
        // this.getViewProt(data);
      },
      customEmit: function(data) {
      },
      getViewProt(data, id) {
        if(this.$socket.id !== data.id) {
          this.canvas.loadFromJSON(JSON.parse(data.data), this.canvas.renderAll.bind(this.canvas), function(o, object) {
          });
        }
      },
      getImage(data) {
        this.getImgData = data;
      }
    },
    data() {
      return {
        canvas: {},
        canvasData: {},
        getImgData: {}
      }
    },
    mounted() {
      this.canvas = new fabric.Canvas('canvas');
      fabric.Object.prototype.transparentCorners = false;  // 不透明
      fabric.Object.prototype.lockRotation = true;
      fabric.Object.prototype.hasRotatingPoint = false;
      fabric.Object.prototype.selectable = true;
      // 禁用组选择
      this.canvas.selection = false;

      let rectObj = new fabric.Rect({
        width: 50, height: 50, left: 0, top: 0,
        fill: 'green'
      });
      this.canvas.add(rectObj);

      this.canvas.on({
        'object:moving': this.onChange,
        'object:scaling': this.onChange,
        'object:rotating': this.onChange
      });

      // ------------------------------------------------------------
      // 拖拽生成矩形
      var rect, isDown, origX, origY;

      this.canvas.on('mouse:down', o => {
        if(o.target !== null) {
          // console.log('not null');
        } else {
          // console.log('null');
          let pointer = this.canvas.getPointer(o.e);
          isDown = true;
          origX = pointer.x;
          origY = pointer.y;
          rect = new fabric.Rect({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            width: pointer.x - origX,
            height: pointer.y - origY,
            fill: 'rgba(255,0,0,0.5)'
          });
          this.canvas.add(rect);
        }
      });

      this.canvas.on('mouse:move', o => {
        if(!isDown) return;

        let pointer = this.canvas.getPointer(o.e);
        if(origX > pointer.x) {
          rect.set({ left: Math.abs(pointer.x) });
        }
        if(origY > pointer.y) {
          rect.set({ top: Math.abs(pointer.y) });
        }
        rect.set({ width: Math.abs(origX - pointer.x) });
        rect.set({ height: Math.abs(origY - pointer.y) });

        this.canvas.renderAll();
      });

      this.canvas.on('mouse:up', o => {
        isDown = false;
        //画图完成后可以选中和移动
        if(rect) {
          rect.setCoords();
        }
      });
      // ------------------------------------------------------------

      // 边界检测
      this.canvas.on('object:moving', o => {
        let pointer = this.canvas.getPointer(o.e);
        let pointer2 = o.target.getBoundingRect();
        // console.log(999, o, pointer, pointer2, this.canvas);
      });
    },
    created() {
      // this.getImage();
    },
    methods: {
      getImage(data) {
        this.getImgData = data;
        this.$socket.emit('getImage', this.getImgData);
      },
      onChange(options) {
        options.target.setCoords();

        this.canvas.forEachObject(function(obj) {
          if(obj === options.target) return;

          // if(Math.abs(options.target.getBoundingRect().left - obj.target.getBoundingRect().left) < 5) {
          //   console.log(8888);
          // }
          // 重叠   // obj.set('opacity', options.target.intersectsWithObject(obj) ? 0.5 : 1);  
          if(options.target.intersectsWithObject(obj)) {
            obj.set('opacity', 0.5);
          } else {
            obj.set('opacity', 1);
          }
        });
        this.$socket.emit('getViewProt', JSON.stringify(this.canvas));
      }
    }
  }
</script>

<style lang="less" scoped>
  .socket {
    width: 100%;
    height: 100%;
    position: relative;
    canvas {
      border: 1px solid green;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>
