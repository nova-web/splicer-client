<template>
  <!-- 使用canvas -->
  <div class="socket">
    <canvas id="canvas" width="800" height="800"></canvas>
    <!-- <video :src="getImgData.video" controls="controls"></video>
    <img :src="getImgData.src" alt=""> -->
    <el-button id="inline-btn" type="primary" icon="el-icon-delete">清除当前选中canvas</el-button>
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
      getViewProt(data) {
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
      // 辅助线
      initAligningGuidelines(this.canvas);
      fabric.Object.prototype.transparentCorners = false;  // 不透明
      fabric.Object.prototype.lockRotation = true;
      fabric.Object.prototype.hasRotatingPoint = false;
      fabric.Object.prototype.selectable = true;
      fabric.Object.prototype.padding = 0;
      // 禁用组选择
      this.canvas.selection = false;

      // ------------------------------------------------------------
      // canvas表格--物理 实线
      let gridsize = 400;  // 表格个数宽度
      let cellWidth = 400; // 表格大小
      for(var x = 1; x < (this.canvas.width / gridsize); x++) {
        this.canvas.add(new fabric.Line([cellWidth * x, 0, cellWidth * x, 800], { stroke: "#000000", strokeWidth: 1, selectable: false }));  // 竖线
        this.canvas.add(new fabric.Line([0, cellWidth * x, 800, cellWidth * x], { stroke: "#000000", strokeWidth: 1, selectable: false }));  // 横线
      }
      // canvas表格--逻辑 虚线
      let gridsize2 = 200;  // 表格个数宽度
      let cellWidth2 = 200; // 表格大小
      for(var x = 1; x < (this.canvas.width / gridsize2); x++) {
        this.canvas.add(new fabric.Line([cellWidth2 * x, 0, cellWidth2 * x, 800], { stroke: "#000000", strokeWidth: 1, strokeDashArray: [5, 5], selectable: false }));  // 竖线
        this.canvas.add(new fabric.Line([0, cellWidth2 * x, 800, cellWidth2 * x], { stroke: "#000000", strokeWidth: 1, strokeDashArray: [5, 5], selectable: false }));  // 横线
      }
      // ------------------------------------------------------------

      // 常规矩形
      let rectObj = new fabric.Rect({
        width: 50, height: 50, left: 0, top: 0,
        fill: 'green'
      });
      this.canvas.add(rectObj);
      // ------------------------------------------------------------








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



      // ------------------------------------------------------------
      // 添加事件
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
        // bug：pointer在canvas外则生成canvas外部的对象，不能被边界限制住
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



      // ------------------------------------------------------------
      // 边界检测
      // this.canvas.on('object:moving', o => {
      //   let pointer = this.canvas.getPointer(o.e);
      //   let pointer2 = o.target.getBoundingRect();
      //   // console.log(pointer, pointer2);

      //   var obj = o.target;
      //   // if object is too big ignore 
      //   if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
      //     return;
      //   }
      //   obj.setCoords();
      //   // top-left corner 
      //   if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
      //     obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
      //     obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
      //   }
      //   // bot-right corner 
      //   if(obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
      //     obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
      //     obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
      //   }
      // });
    },
    created() {
      // this.getImage();
    },
    methods: {
      getImage(data) {
        this.getImgData = data;
        this.$socket.emit('getImage', this.getImgData);
      },
      onChange(o) {
        o.target.setCoords();
        this.canvas.forEachObject(function(obj) {
          if(obj === o.target) return;
          // 重叠   
          // obj.set('opacity', o.target.intersectsWithObject(obj) ? 0.5 : 1);
          if(o.target.intersectsWithObject(obj)) {
            obj.set('opacity', 0.5);
            // obj.animate('opacity', '0.1', { duration: 1000 });
          }
          if(!o.target.intersectsWithObject(obj)) {
            obj.set('opacity', 1);
            // obj.animate('opacity', '1', { duration: 1000 });
          }
        });
        // 向服务端 sock.io 发送数据
        // this.$socket.emit('getViewProt', JSON.stringify(this.canvas));
      },
      // rmCvs() {
      //   // console.log(this.canvas.getActiveObject());
      //   this.canvas.getActiveObject().remove();

      // 该功能检查是否选择了组。如果选择了一个组，则该组的每个对象都将被删除。如果未选择任何组，则该函数会尝试删除所选对象。如果未选择任何内容，则不会更改画布。
      // this.$nextTick(() => {
      //   if(this.canvas.getActiveGroup()) {
      //     this.canvas.getActiveGroup().forEachObject(function(o) { this.canvas.remove(o) });
      //     this.canvas.discardActiveGroup().renderAll();
      //   } else {
      //     this.canvas.remove(this.canvas.getActiveObject());
      //   }
      // });
      // }
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
