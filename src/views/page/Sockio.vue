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
        // this.$socket.emit('initData');   // controller
        console.log('socket connected', data);
        // this.getViewProt(data);
      },
      customEmit: function(data) {
        console.log('socked server-->', data);
      },
      getViewProt(data, id) {
        if(this.$socket.id !== data.id) {
          console.log('viewProt from server', typeof data);
          this.canvas.loadFromJSON(JSON.parse(data.data), this.canvas.renderAll.bind(this.canvas), function(o, object) {
          });
        }
      },
      getImage(data) {
        this.getImgData = data;
        console.log('getImgData from server', data);
      }
    },
    data() {
      return {
        canvas: {},
        canvasData: {},
        getImgData: {},
      }
    },
    mounted() {
      this.canvas = new fabric.Canvas('canvas');
      fabric.Object.prototype.transparentCorners = false;  // 不透明

      // var circle =;

      // var text = ;


      class LabeledRect {
        constructor(label) {
          this.width = 100;
          this.height = 50;
          this.left = 100;
          this.top = 200;
          this.label = label;

        }

        toString() {
          return [
            new fabric.Circle({
              radius: 100,
              fill: '#eef',
              scaleY: 0.5,
              originX: 'center',
              originY: 'center'
            }),

            new fabric.Text(this.label, {
              fontSize: 30,
              originX: 'center',
              originY: 'center'
            })
          ]
        }
      }

      console.log(new LabeledRect('aaas'));

      var group = new fabric.Group(new LabeledRect('aaas').toString(), {
        left: 150,
        top: 100,
        angle: -10,
        fontSize: 10
      });

      this.canvas.add(group);

      // // 父类
      // let LabeledRect = fabric.util.createClass(fabric.Group, {
      //   // 仅用于一致性，因为所有Fabric对象都具有type属性（rect，circle，path，text等）
      //   type: 'LabeledRect',

      //   initialize: function(options) { // 构造函数
      //     options || (options = {});



      //     this.callSuper('initialize', options);
      //     // give all labeled rectangles fixed width/heigh of 100/50
      //     this.set({ width: 100, height: 50 });
      //     this.set('label', options.label || '');
      //   },

      //   toObject: function() {  // 在实例中表示对象（和JSON）
      //     return fabric.util.object.extend(this.callSuper('toObject'), {
      //       label: this.get('label')
      //     });
      //   },

      //   _render: function(ctx) {  // 绘制实例
      //     this.callSuper('_render', ctx);

      //     ctx.font = '20px Helvetica';
      //     ctx.fillStyle = '#333';

      //     console.log("label", this.label);
      //     ctx.fillText(this.label, -this.width / 2, -this.height / 2 + 20);
      //   }
      // });

      // // // 实例
      // let labeledRect = new LabeledRect({
      //   width: 100,
      //   height: 50,
      //   left: 100,
      //   top: 200,
      //   label: 'test',
      //   fill: '#faa'
      // });
      // this.canvas.add(labeledRect);

      // let rect = new fabric.Rect({
      //   width: 200, height: 100, left: 0, top: 55,
      //   fill: 'rgba(255,0,0,0.5)'
      // });
      // this.canvas.add(rect);

      this.canvas.on({
        'object:moving': this.onChange,
        'object:scaling': this.onChange,
        'object:rotating': this.onChange,
        'mouse:down'(e) {
          console.log('selected', e);
        }
      });
    },
    created() {
      this.getImage();
    },
    methods: {
      getImage(data) {
        this.getImgData = data;
        this.$socket.emit('getImage', this.getImgData);
      },
      // canvas移动触发
      onChange(options) {
        this.moving = true;
        options.target.setCoords();
        this.canvas.forEachObject(function(obj) {
          if(obj === options.target) return;
          obj.set('opacity', options.target.intersectsWithObject(obj) ? 0.5 : 1);
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
