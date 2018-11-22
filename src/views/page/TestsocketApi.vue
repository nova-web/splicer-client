<template>
  <div>
    <img src="@/assets/logo.png" alt="" @click="clickButton('niexinyu connection...')">
  </div>
</template>

<script>
  export default {
    name: 'socketio',
    sockets: {
      connect: function() {
        console.log('socket connected');
      },
      custiomEmit: function(data) {
        console.log('socked server-->', data);
      }
    },
    methods: {
      clickButton: function(data) {
        // $socket is socket.io-client instance
        this.$socket.emit('text', data);
      }
    }
  }
</script>

<style>
</style>
