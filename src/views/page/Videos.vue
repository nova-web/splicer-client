<template>
  <div>
    <h1>RTMP:</h1>
    <div class="row">
      <div class="source">
        <div id="rtmp1"></div>
      </div>
      <div class="source">
        <div id="rtmp2"></div>
      </div>
    </div>
    <h1>HLS:</h1>
    <div class="row">
      <div class="source">
        <div id="hls1"></div>
      </div>
      <div class="source">
        <div id="hls2"></div>
      </div>
    </div>
    <h1>Canvas:</h1>
    <div class="row">
      <div class="source">
        <canvas id="canvas1">
          <!-- <source src="../../../static/ychx.mp4"> -->
        </canvas>
      </div>
      <div class="source">
        <canvas id="canvas2"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../common/bus';
  // import videojs from 'video.js';

  export default {
    mounted() {
      this.playHLS('hls1', 'http://172.16.6.200/hls1/test.m3u8');
      this.playHLS('hls2', 'http://172.16.6.200/hls2/test.m3u8');
      this.playRTMP('rtmp1', 'rtmp://172.16.6.200/rtmp1/test');
      this.playRTMP('rtmp2', 'rtmp://172.16.6.200/rtmp2/test');
      this.playSocket('canvas1', 'ws://172.16.6.200:8082');
      this.playSocket('canvas2', 'ws://172.16.6.200:8084');
    },
    methods: {
      playHLS(id, src) {
        cyberplayer(id).setup({
          width: 512,
          height: 384,
          // width: 670,
          // height: 480,
          isLive: true,
          file: src,
          // file: 'http://cyberplayerplay.kaywang.cn/cyberplayer/demo201711-L1.m3u8',
          autostart: true,
          stretching: 'uniform',
          repeat: false,
          volume: 100,
          controls: true,
          hls: {
            reconnecttime: 5 // hls直播的重连次数
          },
          ak: 'cc94de6803904f2ca7159eedeaced55d'
        });
      },
      playRTMP(id, src) {
        cyberplayer(id).setup({
          width: 512,
          height: 384,
          file: src,
          // file: 'rtmp://cyberplayerplay.kaywang.cn/cyberplayer/demo201711-L1',
          autostart: true,
          stretching: 'uniform',
          repeat: false,
          volume: 100,
          controls: true,
          rtmp: {
            reconnecttime: 5, // rtmp直播的重连次数
            bufferlength: 1 // 缓冲多少秒之后开始播放 默认1秒
          },
          ak: 'cc94de6803904f2ca7159eedeaced55d'
        });
      },
      playSocket(id, src) {
        var canvas = document.getElementById(id);
        new JSMpeg.Player(src, { canvas: canvas, autoplay: true, disableGl: true, disableWebAssembly: true });
      }
    }
  }
</script>

<style scoped lang="less">
  .row {
    display: flex;
    .source {
      margin-right: 10px;
      width: 512px;
      height: 384px;
      canvas {
        width: 100%;
      }
    }
  }
</style>
