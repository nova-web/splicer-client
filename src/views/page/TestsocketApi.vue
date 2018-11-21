<template>
  <div class="pt pb">
    <!-- <mt-header title="聊天室"></mt-header> -->
    <div>聊天室2</div>
    <div class="content" ref="content">
      <ul class="chat-wrapper">
        <template v-for="(item, index) in messages">{{messages}}
          <li v-if="item.type" :class="{message: item.type, myself:item.myself}" :key="index">
            <div class="photo"></div>
            <div class="detail">
              <div class="nickname">{{item.nickname}}</div>
              <div class="text">{{item.message}}</div>
            </div>
          </li>
          <li v-else :class="{note: !item.type}" :key="index">{{item.message}}</li>
        </template>
      </ul>
    </div>
    <div class="footer">
      <textarea v-model="sendMessage" name="" id="" cols="30" rows="10"></textarea>
      <button @click="sendMessage.length && send(id, 1, sendMessage)">发送</button>
    </div>
  </div>
</template>

<script>
  import { getSen, setSen } from '../../utils'
  import Bus from '@/views/common/bus';

  export default {
    data() {
      return {
        id: getSen('id'),
        sendMessage: '',
        messages: [],
        myself: false
      }
    },
    created() {
      this.socketApi.sendSock(this.sendMessage, this.send);
    },
    methods: {
      send(msg) {
        this.messages.push({ ...msg, myself: msg.id === this.id })
        if(!this.id && msg.type === 0) {
          this.id = msg.id
          setSen('id', msg.id)
        }
        // Bus.$on('onMessage', msg => {
        //   this.messages.push({ ...msg, myself: msg.id === this.id })
        //   if(!this.id && msg.type === 0) {
        //     this.id = msg.id
        //     setSen('id', msg.id)
        //   }
        // });

        var e = this.$refs.content
        setTimeout(() => {
          e.scrollTop = e.scrollHeight + 10000
        }, 100)

        this.sendMessage = '';
      }
    }
  }
</script>

<style lang="less" scoped>
  .pb {
    padding-bottom: 100px;
  }

  .chat-wrapper {
    padding: 0 14px;
    li {
      padding: 14px 0;
    }
  }

  .note {
    text-align: center;
    color: #999;
  }

  .message {
    display: flex;
    .photo {
      width: 60px;
      height: 60px;
      background: #ddd;
      margin-right: 14px;
      border-radius: 5px;
    }
    .nickname {
      color: #999;
    }
    .text {
      border-radius: 5px;
      background-color: #ddd;
      padding: 10px;
      max-width: 520px;
      word-break: break-word;
      color: #333;
      display: inline-block;
    }
    &.myself {
      flex-direction: row-reverse;
      .detail {
        text-align: right;
      }
      .photo {
        margin-right: 0;
        margin-left: 14px;
      }
      .text {
        background-color: rgb(158, 234, 106);
      }
    }
  }

  .footer {
    display: flex;
    position: absolute;
    bottom: 0;
    right: 0;
    height: 100px;
    left: 0;
    padding: 20px;
    textarea {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 4px;
    }
    button {
      width: 80px;
      padding: 0 0.266667rem;
      margin-left: 0.266667rem;
      color: #fff;
      background-color: #189cff;
      border-radius: 5px;
    }
  }
</style>
