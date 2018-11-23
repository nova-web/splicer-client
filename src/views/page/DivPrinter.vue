<template>
  <div class="div-printer">
    <!-- Fabric绘图 -->
    <canvas id="canvas" width="600" height="600"></canvas>
  </div>
</template>

<script>
  // import { fabric } from 'fabric'
  import logo from '../../assets/logo.png'
  export default {
    name: 'fabric',
    data() {
      return {
      }
    },
    components: {
    },
    computed: {
    },
    mounted() {
      let canvas = new fabric.Canvas('canvas');

      // fabric.Object.prototype.transparentCorners = false;

      // var rect1 = new fabric.Rect({
      //   width: 200, height: 100, left: 0, top: 50, angle: 30,
      //   fill: 'rgba(255,0,0,0.5)'
      // });

      // var rect2 = new fabric.Rect({
      //   width: 100, height: 100, left: 350, top: 250, angle: -10,
      //   fill: 'rgba(0,200,0,0.5)'
      // });

      // var rect3 = new fabric.Rect({
      //   width: 50, height: 100, left: 275, top: 350, angle: 45,
      //   stroke: '#eee', strokeWidth: 10,
      //   fill: 'rgba(0,0,200,0.5)'
      // });

      // var circle = new fabric.Circle({
      //   radius: 50, left: 275, top: 75, fill: '#aac'
      // });

      // var triangle = new fabric.Triangle({
      //   width: 100, height: 100, left: 50, top: 300, fill: '#cca'
      // });

      // canvas.add(rect1, rect2, rect3, circle, triangle);
      // // canvas.on({
      // //   'object:moving': onChange,
      // //   'object:scaling': onChange,
      // //   'object:rotating': onChange,
      // // });

      // function onChange(options) {
      //   alert(999);
      //   options.target.setCoords();
      //   canvas.forEachObject(function(obj) {
      //     if(obj === options.target) return;
      //     obj.set('opacity', options.target.intersectsWithObject(obj) ? 0.5 : 1);
      //   });
      // }

      // Touch events
      fabric.Image.fromURL(logo, function(img) {
        img.scale(0.5).set({
          left: 150,
          top: 150,
          angle: -15
        });
        canvas.add(img).setActiveObject(img);
      });

      // var info = document.getElementById('info');

      canvas.on({
        // 'object:moving': onChange,
        // 'object:scaling': onChange,
        // 'object:rotating': onChange,
        'touch:gesture': function() {
          // var text = document.createTextNode(' Gesture ');
          // info.insertBefore(text, info.firstChild);
          // alert(11);
        },
        'touch:drag': function() {
          // var text = document.createTextNode(' Dragging ');
          // info.insertBefore(text, info.firstChild);
          // alert(22);
        },
        'touch:orientation': function() {
          // var text = document.createTextNode(' Orientation ');
          // info.insertBefore(text, info.firstChild);
          // alert(33);
        },
        'touch:shake': function() {
          // var text = document.createTextNode(' Shaking ');
          // info.insertBefore(text, info.firstChild);
          // alert(44);
        },
        'touch:longpress': function() {
          // var text = document.createTextNode(' Longpress ');
          // info.insertBefore(text, info.firstChild);
          // alert(55);
          console.log('longpress');
        }
      });
    },
    created() {
    },
    methods: {
    }
  }

</script>

<style scoped lang="less">
  .div-printer {
    width: 100%;
    height: 100%;
    position: relative;
    canvas {
      border: 1px solid red;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>
