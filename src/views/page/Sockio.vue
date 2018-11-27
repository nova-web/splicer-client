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
      this.canvas.selection = true;

      // class LabeledRect {
      //   constructor(label) {
      //     this.width = 100;
      //     this.height = 50;
      //     this.left = 100;
      //     this.top = 200;
      //     this.label = label;
      //   }

      //   toString() {
      //     return [
      //       new fabric.Circle({
      //         radius: 100,
      //         fill: '#666',
      //         originX: 'center',
      //         originY: 'center'
      //       }),

      //       new fabric.Text(this.label, {
      //         fontSize: 30,
      //         originX: 'center',
      //         originY: 'center'
      //       })
      //     ]
      //   }
      // }

      // var group = new fabric.Group(new LabeledRect('aaas').toString(), {
      //   left: 150,
      //   top: 100,
      //   fontSize: 10
      // });

      // this.canvas.add(group);

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

      var rect, isDown, origX, origY;

      this.canvas.on('mouse:down', o => {
        if(o.target !== null) {
          // console.log('not null');
        } else {
          // console.log('null');
          isDown = true;
          origX = o.e.layerX;
          origY = o.e.layerY;
          rect = new fabric.Rect({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            width: o.e.layerX - origX,
            height: o.e.layerY - origY,
            fill: 'rgba(255,0,0,0.5)'
          });
          this.canvas.add(rect);
        }
      });

      this.canvas.on('mouse:move', o => {
        if(!isDown) return;

        if(origX > o.e.layerX) {
          rect.set({ left: Math.abs(o.e.layerX) });
        }
        if(origY > o.e.layerY) {
          rect.set({ top: Math.abs(o.e.layerY) });
        }
        rect.set({ width: Math.abs(origX - o.e.layerX) });
        rect.set({ height: Math.abs(origY - o.e.layerY) });

        this.canvas.renderAll();
      });

      this.canvas.on('mouse:up', o => {
        isDown = false;
        //画图完成后可以选中
        if(o.target === null) {
          var objs = this.canvas.getObjects();
          for(var obj in objs) {
            objs[obj].setCoords();   // 如果抬起时，除了自己没有元素，报错：objs[obj].setCoords is not a function
          }
        }
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
          // obj.set('opacity', options.target.intersectsWithObject(obj) ? 0.5 : 1);  // 重叠
          // if(Math.abs(options.target.getBoundingRect().left - obj.target.getBoundingRect().left) < 5) {
          //   console.log(8888);
          // }

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
