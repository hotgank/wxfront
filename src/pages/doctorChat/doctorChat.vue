<template>
  <view class="container">
    <view class="chat-header">
      <text class="doctor-name">{{ doctor.name }}</text>
    </view>
    <scroll-view 
      class="chat-body" 
      scroll-y="true" 
      :scroll-top="scrollTop" 
      @scrolltoupper="loadMoreMessages"
      :scroll-with-animation="true"
      :refresher-enabled="true"
      :refresher-threshold="100"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view v-for="(message, index) in messages" :key="index" class="message-wrapper"
        :class="{ 'self-message': message.isSelf }">
        <image v-if="!message.isSelf" :src="doctor.avatarUrl" class="avatar"></image>
        <view class="message-content" :class="{ 'self-content': message.isSelf }">
          <image v-if="message.type === 'image'" :src="message.content" mode="widthFix" class="message-image"
            @tap="previewImage(message.content)"></image>
          <text v-else class="message-text">{{ message.content }}</text>
        </view>
        <image v-if="message.isSelf" :src="userAvatar" class="avatar"></image>
      </view>
    </scroll-view>
    <view class="chat-footer">
      <input v-model="inputMessage" class="message-input" type="text" placeholder="输入消息..." @confirm="sendMessage" />
      <button class="send-button" @tap="sendMessage">发送</button>
      <button class="image-button" @tap="chooseImage">图片</button>
    </view>
  </view>
</template>

<script>
import { getLast30Messages, selectRelationIdByDoctorId, sendMessageApi } from '@/api/relation';

export default {
  data() {
    return {
      doctor: {
        doctorId: '',
        name: '',
        avatarUrl: '',
        workplace: '',
        rating: 0,
        position: '',
        experience: ''
      },
      relationId: '',
      messages: [],
      inputMessage: '',
      scrollTop: 0,
      userAvatar: '',
      isRefreshing: false,
    };
  },
  async onLoad(option) {
    try {
      if (option.doctor) {
        this.doctor = JSON.parse(decodeURIComponent(option.doctor));
      }
      this.relationId = await selectRelationIdByDoctorId(this.doctor.doctorId);
      await this.fetchMessages();
    } catch (error) {
      console.error('页面初始化失败:', error);
      uni.showToast({
        title: '初始化失败，请稍后重试',
        icon: 'none',
      });
    }
  },
  methods: {
    async fetchMessages() {
      try {
        if (!this.relationId) {
          throw new Error('relationId 不能为空');
        }
        const messages = await getLast30Messages(this.relationId);
        this.messages = messages
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .map(msg => ({
            content: msg.messageText,
            isSelf: msg.senderType === 'user',
            type: msg.messageType === 'text' ? 'text' : 'image',
          }));
        this.scrollToBottom();
      } catch (error) {
        console.error('加载聊天记录失败:', error);
        uni.showToast({
          title: '加载聊天记录失败，请稍后重试',
          icon: 'none',
        });
      }
    },
    async sendMessage() {
      if (!this.inputMessage.trim()) return;
      
      const newMessage = {
        content: this.inputMessage,
        isSelf: true,
        type: 'text',
      };
      this.messages.push(newMessage);
      this.inputMessage = '';
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        await sendMessageApi(
          this.relationId,
          'user',
          newMessage.content
        );
        console.log('消息发送成功:', newMessage.content);
      } catch (error) {
        console.error('发送消息失败:', error);
        uni.showToast({
          title: '消息发送失败，请稍后重试',
          icon: 'none',
        });
      }
    },
    async chooseImage() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          const newImageMessage = {
            content: tempFilePath,
            isSelf: true,
            type: 'image',
          };
          this.messages.push(newImageMessage);

          this.$nextTick(() => {
            this.scrollToBottom();
          });

          try {
            await sendMessageApi(
              this.relationId,
              'user',
              '[图片]',
              'image',
              tempFilePath
            );
            console.log('图片发送成功:', tempFilePath);
          } catch (error) {
            console.error('发送图片失败:', error);
            uni.showToast({
              title: '图片发送失败，请稍后重试',
              icon: 'none',
            });
          }
        },
      });
    },
    previewImage(url) {
      uni.previewImage({
        urls: [url],
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.chat-body').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec((res) => {
          if (res[0] && res[1]) {
            this.scrollTop = res[0].height;
          }
        });
      });
    },
    async loadMoreMessages() {
      console.log('加载更多消息');
      // Implement logic for loading more messages here
    },
    async onRefresh() {
      this.isRefreshing = true;
      await this.fetchMessages();
      this.isRefreshing = false;
    },
  },
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-header {
  background-color: #f8f8f8;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.doctor-name {
  font-size: 18px;
  font-weight: bold;
}

.chat-body {
  flex: 1;
  padding: 10px;
  background-color: #f0f0f0;
  overflow-y: auto;
  /* 避免滚动问题 */
}

.message-wrapper {
  display: flex;
  margin-bottom: 10px;
}

.self-message {
  justify-content: flex-end;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
}

.self-content {
  background-color: #9eea6a;
}

.message-text {
  font-size: 16px;
  line-height: 1.4;
}

.message-image {
  max-width: 100%;
  border-radius: 5px;
}

.chat-footer {
  display: flex;
  padding: 10px;
  background-color: #f8f8f8;
  border-top: 1px solid #e0e0e0;
}

.message-input {
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 18px;
  font-size: 16px;
}

.send-button,
.image-button {
  margin-left: 10px;
  padding: 0 15px;
  height: 36px;
  line-height: 36px;
  border: none;
  border-radius: 18px;
  background-color: #007aff;
  color: #fff;
  font-size: 16px;
}

.image-button {
  background-color: #4cd964;
}
</style>
