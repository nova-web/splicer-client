<template>
  <div class="div-printer">
    <!-- Fabric绘图 -->
    <canvas id="canvas" width="800" height="800"></canvas>
  </div>
</template>

<script>
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
      //引用canvas元素（id = 'canvas'）
      let canvas = new fabric.Canvas('canvas');
      // 背景图
      // canvas.setBackgroundImage(logo, canvas.renderAll.bind(canvas));
      //let canvas = new fletabric.Canvas('c', {
      //   backgroundColor: 'rgb(100,100,200)',
      //   selectionColor: 'blue',
      //   selectionLineWidth: 2
      //   // ...
      // });
      // canvas.onFpsUpdate = function(){ /* ... */ };

      // 每个选择点相关操作
      // 大多数对象都继承自fabric.Object根对象
      // 这种继承允许您在fabric.Object中定义方法，并在所有“类”女儿之间共享它们。例如，如果要在所有对象上使用getAngleInRadians方法，则只需在fabric.Object.prototype中创建它
      // fabric.Object.prototype.getAngleInRadians = function() {
      //   return this.get('Angle') / 180 * Math.PI;
      // };
      // let rect = new fabric.Rect({ angle: 45 });
      // rect.getAngleInRadians(); // 0.785...
      fabric.Object.prototype.transparentCorners = false;  // 不透明
      fabric.Object.prototype.lockRotation = true;
      fabric.Object.prototype.hasRotatingPoint = false;
      fabric.Object.prototype.cornerStyle = 'circle';
      fabric.Object.prototype.set({
        borderColor: 'red',
        cornerColor: 'green',
        cornerSize: 10
      });

      canvas.selection = false; //禁用组选择  // 组: 矩形上写文字 new fabric.Group([ text, circle ], {});  https://github.com/rodrigopandini/articles-fabric.js/blob/master/Part-3.md


      // ------------------------------------------------------------------------------
      // 虚线
      let dashline = new fabric.Line([0, 20, 100, 20], {
        strokeDashArray: [5, 5],
        stroke: 'black'
      });


      // ------------------------------------------------------------------------------
      // 创建矩形1
      let rect1 = new fabric.Rect({
        width: 50, height: 50, left: 0, top: 0,
        fill: 'green'
      });
      // 更改参数，重新渲染
      rect1.set({ left: 100, top: 0 });
      rect1.set('fill', 'red');
      rect1.set({ strokeWidth: 5, stroke: 'rgba(100,200,200,0.5)' });
      rect1.set('angle', 1).set('flipY', true);
      rect1.set('selectable', false); //使对象无法选择
      rect1.animate('left', '+200', { onChange: canvas.renderAll.bind(canvas) }); // 动画 https://github.com/rodrigopandini/articles-fabric.js/blob/master/Part-2.md
      console.log(rect1.get('width'));  // rect.getWidth();  error: is not a function   args: width, height, left, top, fill, stroke, opacity
      canvas.renderAll();  // 每次修改对象的参数后需要执行canvas.renderAll()重新渲染，否则不会出效果。



      let rect2 = new fabric.Rect({
        width: 200, height: 100, left: 0, top: 55,
        fill: 'rgba(255,0,0,0.5)'
      });

      let text = new fabric.Text('hello world', { left: 100, top: 100, fontSize: 16, fontWeight: 'normal' }); // 字体  https://github.com/rodrigopandini/articles-fabric.js/blob/master/Part-2.md
      canvas.add(rect1, rect2, text, dashline);

      canvas.on({
        'object:moving': onChange,
        'object:scaling': onChange,
        'object:rotating': onChange,
      });
      // 交叉 下方canvas透明度0.5
      function onChange(options) {
        options.target.setCoords();
        canvas.forEachObject(function(obj) {
          if(obj === options.target) return;
          obj.set('opacity', options.target.intersectsWithObject(obj) ? 0.5 : 1);
        });
      }

      // ------------------------------------------------------------------------------
      // subclasse   https://github.com/rodrigopandini/articles-fabric.js/blob/master/Part-3.md
      // createClass获取一个对象并使用该对象的属性来创建具有实例级属性的“类”
      // 继承矩阵，LabeledRect基本上是一个矩形，其标签类型与之相关联。当我们在画布上渲染时，标签将表示为矩形内的文本。
      let LabeledRect = fabric.util.createClass(fabric.Rect, {
        // 仅用于一致性，因为所有Fabric对象都具有type属性（rect，circle，path，text等）
        type: 'labeledRect',

        initialize: function(options) { // 构造函数
          options || (options = {});

          this.callSuper('initialize', options);
          // give all labeled rectangles fixed width/heigh of 100/50
          this.set({ width: 100, height: 50 });
          this.set('label', options.label || '');
        },

        toObject: function() {  // 在实例中表示对象（和JSON）
          return fabric.util.object.extend(this.callSuper('toObject'), {
            label: this.get('label')
          });
        },

        _render: function(ctx) {  // 绘制实例
          this.callSuper('_render', ctx);

          ctx.font = '20px Helvetica';
          ctx.fillStyle = '#333';
          ctx.fillText(this.label, -this.width / 2, -this.height / 2 + 20);
        }
      });

      let labeledRect = new LabeledRect({
        width: 100,
        height: 50,
        left: 100,
        top: 200,
        label: 'test',
        fill: '#faa'
      });
      canvas.add(labeledRect);
      labeledRect.set({
        label: 'trololo',
        fill: '#aaf',
        rx: 10,
        ry: 10
      });

      // ------------------------------------------------------------------------------
      // Touch events
      fabric.Image.fromURL(logo, function(img) {
        img.scale(0.5).set({
          left: 0,
          top: 700
        });
        // setActiveObject 将作为参数传递的对象设置为活动对象。当前所选对象将被丢弃。
        canvas.add(img).setActiveObject(img);
      });

      canvas.on({
        'touch:gesture': function() {
        },
        'touch:drag': function() {
        },
        'touch:orientation': function() {
        },
        'touch:shake': function() {
        },
        'touch:longpress': function() {
        }
      });
      // ------------------------------------------------------------------------------
      // 操作
      canvas.item(0); //引用fabric.Rect添加了早期（第一个对象）
      canvas.getObjects(); //获取画布上的所有对象（rect将是第一个也是唯一的）
      // canvas.remove(rect1); //删除以前添加的fabric.Rect

      // 序列化  https://github.com/rodrigopandini/articles-fabric.js/blob/master/Part-3.md
      // 在服务器上保存的画布内容，或者内容流传输到另一个客户端
      // console.log(JSON.stringify(canvas));
      // console.log(canvas.toObject());
      // console.log(canvas.toSVG());
      // 反序列化
      // canvas.loadFromJSON('...');
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
<!-- 
介绍下常用的配置参数，这些配置参数可用来配置fabric对象
width宽：number,
height高：number,
fill填充颜色：string,
stroke描边颜色:string,
strokeWidth描边宽度：number,
angle角度:number,
left左边距:number,
top上边距:number,
originX横轴中心点:['center'|'left'|'right],
originY纵轴中心点:['center|'top'|'bottom'],
flipX水平翻转:boolean,
flipY垂直翻转：boolean,  
  
  
开发人员可以通过以下方式在用户鼠标交互之外创建/销毁或更改选择：
canvas.setActiveObject(object)将作为参数传递的对象设置为活动对象。当前所选对象将被丢弃。
canvas.discardActiveObject()删除当前选择。
canvas.getActiveObject()返回对当前活动对象的引用。
canvas.getActiveObjects()返回一个数组，其中包含对当前所选对象（一个或多个）的引用。
这些方法都不会再次渲染画布，因此您必须canvas.requestRenderAll在它们之后调用以查看更改。 
canvas._setActiveObject()和canvas._discardActiveObject()是非私人方法中使用的两种私有方法来进行选择工作。
它们不包含事件触发代码，并且它们不可链接。如果您需要处理选择过程但不想激发您在选择事件中插入的副作用，您可以尝试使用它们。

关于选择结构提供回调和事件。
对象触发的事件是：
selected
deselected
画布触发的事件是：
selection:created
selection:updated
before:selection:cleared
selection:cleared
//已弃用
object:selected
对于每个对象都有2个回调
onDeselect
onSelect
那些回调是空的并且意味着被覆盖，并且不应该用于执行很多逻辑，而只是返回一个布尔值来取消当前进程，这取决于动态条件，对于这些条件，可变属性，偶数或其他对象的属性变异不是舒适或反正带来奇怪的代码路径。

Firing events
这些事件旨在拦截用户与结构选择的交互。每当用户从没有选择的情况转到选择的情况时，
您应该期望画布触发selection:created。选择过程中涉及的每个对象，一个或多个，通过单击或单击并拖动，将触发selected事件。
当selection:created触发时，它作为回调的第一个参数接收包含属性“selected”的对象，其中包含所有选定结构实例的数组。
当用户从多选中移除或添加对象或从单选切换到多选时，或者只是将选择从对象A移动到对象B时，事件selection:updated火灾。该事件作为回调的第一个参数接收一个对象，该对象包含“已选择”和“已取消选择”属性，该属性包含进入或退出选择状态的对象数组。该过程中涉及的每个对象都会触发自己的单个事件。
最后，当用户销毁多个选择或取消选择一个对象时，事件将selection:cleared触发，使用“取消选择”属性获取参数。
该事件object:selected被视为已弃用，将在下一个主要版本的fabricjs中删除。

多次选择的回调
在单击和拖动选择或移位点击选择上，onSelect和onDeselect的回调尚不可用，并且只要分支2.0准备好就会作为功能添加。



注：
若要canvas感知该对象的具体位置（用于对象间碰撞边缘检测，或事件响应），需要使用setCoords方法重设对象的四个角坐标。




控制： http://fabricjs.com/controls-customization  // 注：  hasControls / hasBorders / hasRotatingPoint / visible / selectable / evented / transparentCorners / centeredScaling / centeredRotation


层级：你可以得到z - index:canvas.getObjects().indexOf(some_object)。   // https://www.kancloud.cn/cxr17618/fabricjs/621301
四个命令可以改变叠加顺序:
var t = canvas.getActiveObject();
canvas.sendBackwards(t) //向下跳一层
canvas.sendToBack(t)    //向下跳底层：
canvas.bringForward(t)  //向上跳一层：
canvas.bringToFront(t)  //向上跳顶层：
//或者：
t.sendBackwards();
t.sendToBack();
t.bringForward();
t.bringToFront();


//////////在一个固定的范圈内拖动
var goodtop, goodleft, boundingObject;

canvas.on("object:moving", function(){
var obj = this.relatedTarget;
var bounds = boundingObject;
obj.setCoords();
if(!obj.isContainedWithinObject(bounds)){
obj.setTop(goodtop);
obj.setLeft(goodleft);
canvas.refresh();
} else {
goodtop = obj.top;
goodleft = obj.left;
}
});


Api:
calcViewportBoundaries()  使用当前viewportTransform计算画布4角的位置。有助于使用对象绝对坐标确定对象何时在当前渲染视口中（aCoords）
 -->

