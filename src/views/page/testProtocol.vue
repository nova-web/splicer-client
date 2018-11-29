<template>
  <div class="testProtocol">13</div>
</template>

<script>
  export default {
    data() {
      return {
        packageNum: ['55', 'AA', '00', '04', 'FA', '00', '00', '00', '00', '00', '00', '00', '10', '00', '02', '13', 'E0', '00', '02', '03'], // 和是302 02 03
        // 55 AA 00 04 FA 00 00 00 00 00 00 00 01 00 01 13 E0 00 48 57
        // packageNum: '55AA0004FA0000000000000001000113E0004857'
        // packageNum: [0x55, 0xAA, 0x00, 0x04, 0xFA, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x02, 0x13, 0xE0, 0x00, 0x48, 0x57],
        WIN_INFO: 0x13020010,
        id: 0
      }
    },
    created() {

    },
    methods: {
      // 请求包 装包
      installPackage() {
        const buffer = new ArrayBuffer(20);
        const dv = new DataView(buffer);
        // 在第1个字节，以大端字节序写入值为25的无符号整数
        dv.setUint8(0, 55);


      },
      installPackage2string(reqInfo, RW) {
        // // 流水号，同一条指令的请求包和响应包的labels相同，此处自增
        // if(this.id > 255) {
        //   this.id = 0;
        // }
        // let idx = this.id,
        // const reqHead1 = '55',
        // const reqHead2 = 'AA',
        // const ack = '00',
        // const labels = this.fillZero(idx.toString(16)),
        // const sourceAddr = 'FE',  // 计算机的固定地址：0xFE
        // const destinationAddr = '00',  // 目的地址 发送卡00
        // const deviceType = '00',  // 要访问的设备类型
        // const portAddress = '00',
        // const boardAddr1 = '00',
        // const boardAddr2 = '00',
        //   RW = (RW === 0 ? this.fillZero("0") : this.fillZero("0")),
        // const code = RW,
        // const packetType = '00',

        // // 读 偏移  13 02 00 10  
        // const offset = (this.WIN_INFO + "").substr(2), // 去掉0x

        // // 读操作的请求包不带数据，响应包带数据；写操作的请求包带数据，响应包不带数据。

      },
      // 响应包 解析
      analyticPackage(resPackage) {

      },
      // 十位补0
      fillZero(hex) {
        let zero = '00';
        let tmp = 2 - hex.length;
        return zero.substr(0, tmp) + hex;

      }
    }
  }
</script>

<style>
</style>
<!--
http://es6.ruanyifeng.com/#docs/arraybuffer
DataView 视图提供 8 个方法写入内存。

setInt8：写入 1 个字节的 8 位整数。
setUint8：写入 1 个字节的 8 位无符号整数。
setInt16：写入 2 个字节的 16 位整数。
setUint16：写入 2 个字节的 16 位无符号整数。
setInt32：写入 4 个字节的 32 位整数。
setUint32：写入 4 个字节的 32 位无符号整数。
setFloat32：写入 4 个字节的 32 位浮点数。
setFloat64：写入 8 个字节的 64 位浮点数。

DataView实例提供 8 个方法读取内存。

getInt8：读取 1 个字节，返回一个 8 位整数。
getUint8：读取 1 个字节，返回一个无符号的 8 位整数。
getInt16：读取 2 个字节，返回一个 16 位整数。
getUint16：读取 2 个字节，返回一个无符号的 16 位整数。
getInt32：读取 4 个字节，返回一个 32 位整数。
getUint32：读取 4 个字节，返回一个无符号的 32 位整数。
getFloat32：读取 4 个字节，返回一个 32 位浮点数。
getFloat64：读取 8 个字节，返回一个 64 位浮点数。
-->