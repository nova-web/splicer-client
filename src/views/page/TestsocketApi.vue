<template>
  <div class="socket">
    <img class="img" src="@/assets/logo.png" alt="" v-drag="drag" draggable="true" :style="{left:data.x, top:data.y}">
  </div>
</template>

<script>
  export default {
    name: 'socketio',
    sockets: {
      connect: function() {
        // this.$socket.emit('initData');   // controller
        console.log('socket connected');
      },
      customEmit: function(data) {
        console.log('socked server-->', data);
      },
      firstData(data) { //接收数据
        this.data = data;
        console.log('firstData', data);
      },
      getViewProt(data) {
        this.data = data;
        console.log('viewProt from server', data);
      }
    },
    data() {
      return {
        data: {},
        getdata: {}
      }
    },
    methods: {
      drag(data) {
        this.data = data;
        this.$socket.emit('getViewProt', this.data);
      }
    }
  }
</script>

<style lang="less" scoped>
  .socket {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
  }
  .imgpng {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
</style>
