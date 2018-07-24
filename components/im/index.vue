<template>
  <div class="chat">
    <div class="content" ref="chatbox" @scroll="onScroll($event)">
      <div v-for="item in msgLog" class="content-detail-box">
        <div class="msg-time">
          {{ item._timestamp | formatTime }}
        </div>
        <template v-if="item.from === myClientId">
          <div class="msg-box-right">
            <div class="msg-detail-wrapper">
              <div class="msg-username username-right">{{ item.from }}</div>
              <div class="msg-text">
                <span v-if="item.content._lctype === TextMessage.TYPE">{{ item.content._lctext }}</span>
                <img v-else-if="item.content._lctype === ImageMessage.TYPE" @click="onClickImage(item.content._lcfile.url)" style="width: 100%;" :src="item.content._lcfile.url">
                <span v-else>[不支持当前消息类型]</span>
              </div>
            </div>
            <UserAvatar v-if="membersMap[item.from]" :username="item.from" :color="membersMap[item.from].color" :online="false" :size="40"></UserAvatar>
          </div>
        </template>
        <template v-else-if="item.from === 'system'">
          <div class="begin-text-wrapper">
            <div class="begin-text">{{ item.content._lctext }}</div>
          </div>
        </template>
        <template v-else>
          <div class="msg-box-left">
            <UserAvatar v-if="membersMap[item.from]" :username="item.from" :color="membersMap[item.from].color" :online="false" :size="40"></UserAvatar>
            <div class="msg-detail-wrapper">
              <div class="msg-username username-left">{{ item.from }}</div>
              <div class="msg-text">
                <span v-if="item.content._lctype === TextMessage.TYPE">{{ item.content._lctext }}</span>
                <img v-else-if="item.content._lctype === ImageMessage.TYPE" @click="onClickImage(item.content._lcfile.url)" style="width: 100%;" :src="item.content._lcfile.url">
                <span v-else>[不支持当前消息类型]</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="input-box">
      <b-input-group class="input-group">
        <b-form-input placeholder="输入信息，回车发送" type="text" class="input-text" v-model="message" @keyup.enter.native="onSendMsg"></b-form-input>
        <b-input-group-append>
          <input id="chat-file-image" type="file" accept="image/*" style="display: none;" ref="fileSelector" @change="onUpload">
          <b-btn id="upload" @click="onSelectFile">
            <span style="color: #52cbca;"><i class="iconfont icon-attachment"></i></span>
          </b-btn>
        </b-input-group-append>
      </b-input-group>
    </div>
    <div v-if="!!tips" class="toast"><div class="toast-content">{{ tips }}</div></div>
    <modal v-model="modalData.show" :src="modalData.src"></modal>
  </div>
</template>

<script>
  import { Realtime, TextMessage, Event } from 'leancloud-realtime'
  import { ImageMessage } from 'leancloud-realtime-plugin-typed-messages'
  import AV from 'leancloud-storage'
  import UserAvatar from '~/components/user-avatar'
  import Modal from './modal'
  // import InfiniteScrollDirective from './infinite-scroll-directive.js'

  let HAD_INIT_AV = false

  export default {
    data() {
      return {
        ImageMessage,
        TextMessage,
        modalData: {
          show: false,
          src: '',
        },
        tips: '',
        colors: ['#b2d9fd', '#fae7a3', '#ceeaaf', '#ffddd3', '#d4bfe8'],
        members: [], // members[0]必须保证为自己
        message: '',
        myClient: null,
        conversation: null,
        limit: 20,
        messageIterator: null,
        msgLog: [],
        loading: false, // 消息加载中
        loadAll: false, // 是否已经加载全部消息
      }
    },
    components: {
      UserAvatar,
      Modal,
    },
    beforeDestroy() {
      this.myClient = null
      this.conversation = null
      this.messageIterator = null
    },
    mounted() {
      // test
      this.members = JSON.parse(window.localStorage.getItem('members')) || ['leo', 'jeff']

      const APP_ID = 'OibOYNHFsWoqChdhAlebT7rS-gzGzoHsz'
      const APP_KEY = 'IEIfsx2I6LkRajvtP2jcoCIW'
      if (!HAD_INIT_AV) {
        AV.init(APP_ID, APP_KEY)
        HAD_INIT_AV = true
      }
      const realtime = new Realtime({
        appId: APP_ID,
        appKey: APP_KEY,
      })
      realtime.on(Event.DISCONNECT, function () {
        console.log('服务器连接已断开')
      })
      realtime.on(Event.OFFLINE, function () {
        console.log('离线（网络连接已断开）')
      })
      realtime.on(Event.ONLINE, function () {
        console.log('已恢复在线')
      })
      realtime.on(Event.SCHEDULE, function (attempt, delay) {
        console.log(delay + 'ms 后进行第' + (attempt + 1) + '次重连')
      })
      realtime.on(Event.RETRY, function (attempt) {
        console.log('正在进行第' + (attempt + 1) + '次重连')
      })
      realtime.on(Event.RECONNECT, function () {
        console.log('与服务端连接恢复')
      })
      realtime.createIMClient(this.myClientId).then(myClient => {
        this.myClient = myClient
        myClient.on(Event.MESSAGE, this.messageHandler)

        return myClient.createConversation({
          members: this.members.slice(1), // 排除自己
          name: `${this.members.join(' & ')} 聊天`,
          unique: true,
        })
      }).then(conversation => {
        this.conversation = conversation
        // 有用户被添加至某个对话
        conversation.on(Event.MEMBERS_JOINED, payload => {
          console.log('MEMBERS_JOINED', payload.members, payload.invitedBy)
          this.pushSystemMessage(`当前聊天用户: ${payload.members.join(' & ')}`)
        })
        // 有成员被从某个对话中移除
        conversation.on(Event.MEMBERS_LEFT, payload => {
          console.log('MEMBERS_LEFT', payload.members, payload.kickedBy)
        })
        // 当前用户被添加至某个对话
        conversation.on(Event.INVITED, payload => {
          console.log('INVITED', payload.invitedBy)
        })
        // 当前用户被从某个对话中移除
        conversation.on(Event.KICKED, payload => {
          console.log('KICKED', payload.kickedBy)
        })
        conversation.on(Event.UNREAD_MESSAGES_COUNT_UPDATE, conversations => {
          console.log(conversations)
        })
        this.messageIterator = conversation.createMessagesIterator({
          limit: this.limit,
        })
        this.initMsgLog()
      })
    },
    computed: {
      membersMap() {
        const map = {}
        this.members.forEach((member, index) => {
          map[member] = {
            index,
            color: this.colors[index],
          }
        })
        return map
      },
      myClientId() {
        return this.members[0]
      },
    },
    methods: {
      onScroll(evt) {
        if (this.loadAll) {
          return
        }
        if (evt.target.scrollTop < 10) {
          console.log('loadMore')
          this.loadMore()
        }
      },
      pushSystemMessage(text) { // 添加系统暂态消息，不会保存到服务器，暂时支持纯文字
        this.msgLog.push({
          from: 'system',
          content: {
            _lctext: text,
            _lctype: this.TextMessage.TYPE,
          },
          _timestamp: Date.now(),
        })
      },
      onClickImage(src) {
        this.modalData.src = src
        this.modalData.show = true
      },
      onUpload(evt) {
        const file = evt.target.files[0]
        if (file.size > 5000000) {
          this.$refs.fileSelector.value = '' // 需要重置dom
          this.tips = '单文件不可超过5M'
          setTimeout(() => {
            this.tips = ''
          }, 3000)
          return
        }
        if (file.name) {
          this.tips = '发送中...0%'
          const fileObj = new AV.File(file.name, file)
          fileObj.save({
            onprogress(e) {
              console.log(e.percent)
              this.tips = `发送中...${e.percent}%`
            },
          }).then(savedFile => {
            const message = new ImageMessage(savedFile)
            return this.conversation.send(message)
          }).then((message) => {
            console.log(message)
            this.tips = '发送成功...100%'
            setTimeout(() => {
              this.tips = ''
              this.messageHandler({
                ...message,
                content: { // leancloud返回字段content=undefined，需要自己补充
                  _lcfile: message._lcfile,
                  _lctype: message.type,
                },
              })
            }, 1500)
          }).catch(err => {
            this.tips = `发送失败 ${err}`
          })
        }
      },
      onSelectFile() {
        this.$refs.fileSelector.click()
      },
      signatureFactory(clientId) {
        return this.axios.chat.connect({
          client_id: clientId,
        })
      },
      conversationSignatureFactory(conversationId, clientId, targetIds, action) {
        return this.axios.chat.startConversation({
          conv_id: conversationId,
          client_id: clientId,
          members: targetIds.join(','),
          action,
        })
      },
      messageHandler(msg) {
        this.msgLog.push(msg)
        this.scrollToBottom()
      },
      initMsgLog() {
        this.messageIterator.next().then((res) => {
          if (res.value) {
            this.msgLog = res.value.concat(this.msgLog)
            this.pushSystemMessage('现在可以开始聊天')
            this.scrollToBottom()
          }
        })
      },
      loadMore() {
        if (!this.loading) {
          this.loading = true
          this.messageIterator.next().then((res) => {
            this.loading = false
            this.loadAll = res.done
            if (res.value) {
              this.msgLog = res.value.concat(this.msgLog)
            }
          })
        }
      },
      onSendMsg() {
        const msg = this.message.trim()
        if (msg) {
          this.conversation.send(new TextMessage(msg)).then(message => {
            this.msgLog.push({
              ...message,
              content: { // leancloud返回字段content=undefined，需要自己补充
                _lctext: message._lctext,
                _lctype: message.type,
              },
            })
            this.message = ''
            this.scrollToBottom()
          }).catch(console.error.bind(console))
        }
      },
      scrollToBottom() {
        const tid = setTimeout(() => {
          const target = this.$refs.chatbox
          if (target) {
            target.scrollTop = target.scrollHeight
          }
          clearTimeout(tid)
        }, 200)
      },
    },
    filters: {
      formatTime(timestamp) {
        const time = new Date(timestamp)
        const precision = 'second'
        let timeText = ''
        switch (precision) {
          case 'second':
            timeText =
              time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
          case 'minute': // eslint-disable-line no-fallthrough
            if (precision !== 'minute') {
              timeText = ':' + timeText
            }
            timeText =
              (time.getMinutes() > 9
                ? time.getMinutes()
                : '0' + time.getMinutes()) + timeText
          case 'hour': // eslint-disable-line no-fallthrough
            if (precision !== 'hour') {
              timeText = ':' + timeText
            }
            timeText =
              (time.getHours() > 9 ? time.getHours() : '0' + time.getHours()) +
              timeText
          case 'day': // eslint-disable-line no-fallthrough
            if (precision !== 'day') {
              timeText = ' ' + timeText
            }
            timeText =
              (time.getDate() > 9 ? time.getDate() : '0' + time.getDate()) +
              timeText
          case 'month': // eslint-disable-line no-fallthrough
            if (precision !== 'month') {
              timeText = '-' + timeText
            }
            timeText =
              (time.getMonth() + 1 > 9
                ? time.getMonth() + 1
                : '0' + (time.getMonth() + 1)) + timeText
          case 'year': // eslint-disable-line no-fallthrough
            if (precision !== 'year') {
              timeText = '-' + timeText
            }
            timeText = time.getFullYear() + timeText
            break
          default:
            break
        }
        return timeText
      },
    },
  }
</script>

<style lang="scss">
  .chat {
    width: 400px;
    height: 480px;
    background-color: #fff;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .toast {
      position: absolute;
      left: 0;
      bottom: 60px;
      width: 100%;
      .toast-content {
        width: 150px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        border-radius: 5px;
        margin: 0 auto;
        font-size: 14px;
      }
    }
    .title {
      position: relative;
      width: 100%;
      height: 30px;
      background-color: #ccc;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
    .content {
      overflow-y: auto;
      overflow-x: hidden;
      flex: 10;
      padding: 10px 30px;
      .content-detail-box {
        margin-bottom: 20px;
      }
      .begin-text-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        .begin-text {
          display: inline-block;
          text-align: center;
          font-size: 12px;
          color: #9b9b9b;
          width: auto;
          height: auto;
          line-height: 22px;
          background-color: rgba(221, 221, 221, .32);
          margin: 10px auto;
          border-radius: 15px;
          padding: 0 10px;
        }
      }
      .msg-username {
        font-size: 12px;
        color: #9b9b9b;
      }
      .msg-time {
        text-align: center;
        color: #9b9b9b;
        font-size: 12px;
      }
      .msg-box-left {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px;
        .msg-detail-wrapper {
          padding-left: 10px;
          .username-left {
            text-align: left;
          }
          .msg-text {
            position: relative;
            margin-top: 7px;
            float: left;
            max-width: 250px;
            padding: 5px;
            border-radius: 4px;
            // word-break: break-all;
            word-wrap: break-word;
            background-color: #f9f9f9;
            &::after {
              content: "";
              position: absolute;
              display: block;
              border-style: solid;
              border-color: #f9f9f9 transparent transparent;
              border-right-color: #f9f9f9;
              border-width: 8px;
              border-left-color: transparent;
              border-left-width: 0;
              border-top-color: transparent;
              margin: -8px 0 0;
              top: 15px;
              left: -8px;
              right: auto;
              bottom: auto;
            }
          }
        }
      }
      .msg-box-right {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
        .msg-detail-wrapper {
          padding-right: 10px;
          .username-right {
            text-align: right;
          }
          .msg-text {
            position: relative;
            margin-top: 7px;
            float: right;
            padding-right: 10px;
            max-width: 250px;
            padding: 5px;
            border-radius: 4px;
            // word-break: break-all;
            word-wrap: break-word;
            background-color: #f9f9f9;
            &::after {
              content: "";
              position: absolute;
              display: block;
              border-style: solid;
              border-color: #f9f9f9 transparent transparent;
              border-left-color: #f9f9f9;
              border-width: 8px;
              border-right-color: transparent;
              border-right-width: 0;
              border-top-color: transparent;
              margin: -8px 0 0;
              top: 15px;
              right: -8px;
              left: auto;
              bottom: auto;
            }
          }
        }
      }
    }
    .input-box {
      flex: 1;
      width: 100%;
      .input-group {
        height: 100%;
        border-top: solid 1px #ddd;
      }
      .input-text {
        height: 100%;
        border: 0;
      }
      #upload {
        background-color: #fff;
        border: 0;
      }
    }
  }
</style>
