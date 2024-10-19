<template>
    <view class="container">
      <view class="chat-header">
        <text class="doctor-name">{{ doctorName }}</text>
      </view>
      <scroll-view class="chat-body" scroll-y="true" :scroll-top="scrollTop" @scrolltoupper="loadMoreMessages">
        <view v-for="(message, index) in messages" :key="index" class="message-wrapper" :class="{ 'self-message': message.isSelf }">
          <image v-if="!message.isSelf" :src="doctorAvatar" class="avatar"></image>
          <view class="message-content" :class="{ 'self-content': message.isSelf }">
            <image v-if="message.type === 'image'" :src="message.content" mode="widthFix" class="message-image" @tap="previewImage(message.content)"></image>
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
  export default {
    data() {
      return {
        doctorName: '张医生',
        doctorAvatar: '/static/doctor-avatars/doctor1.jpg',
        userAvatar: '/static/user-avatar.jpg',
        messages: [],
        inputMessage: '',
        scrollTop: 0,
        doctors: [
          {
            id: 1,
            name: '张医生',
            avatar: '/static/doctor-avatars/doctor1.jpg',
            hospital: '北京协和医院',
            specialty: '脊柱侧弯、颈椎病'
          },
          {
            id: 2,
            name: '李医生',
            avatar: '/static/doctor-avatars/doctor2.jpg',
            hospital: '上海瑞金医院',
            specialty: '青少年体态矫正、运动损伤'
          },
          {
            id: 3,
            name: '王医生',
            avatar: '/static/doctor-avatars/doctor3.jpg',
            hospital: '广州中山大学附属第一医院',
            specialty: 'Cobb角测量、脊柱畸形'
          }
        ]
      }
      
    },
    onLoad(option) {
      // 这里可以根据传入的 doctorId 获取医生信息
      const doctorId = option.id;
      const doctor = this.doctors.find(d => d.id == option.id);
    if (doctor) {
      this.doctorName = doctor.name;
      this.doctorAvatar = doctor.avatar;
    }
      // 模拟一些初始消息
      this.messages = [
        { content: '您好,有什么可以帮助您的吗？', isSelf: false, type: 'text' },
        { content: '你好医生，我最近感觉腰部有些不适。', isSelf: true, type: 'text' },
        { content: '能否详细描述一下症状？持续时间多久了？', isSelf: false, type: 'text' }
      ];
      this.scrollToBottom();
    },
    methods: {
      sendMessage() {
        if (this.inputMessage.trim()) {
          this.messages.push({
            content: this.inputMessage,
            isSelf: true,
            type: 'text'
          });
          this.inputMessage = '';
          this.scrollToBottom();
        }
      },
      chooseImage() {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            const tempFilePath = res.tempFilePaths[0];
            this.messages.push({
              content: tempFilePath,
              isSelf: true,
              type: 'image'
            });
            this.scrollToBottom();
          }
        });
      },
      previewImage(url) {
        uni.previewImage({
          urls: [url]
        });
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const query = uni.createSelectorQuery().in(this);
          query.select('.chat-body').boundingClientRect();
          query.selectViewport().scrollOffset();
          query.exec((res) => {
            if (res[0] && res[1]) {
              this.scrollTop = res[0].height - res[1].height;
            }
          });
        });
      },
      loadMoreMessages() {
        // 这里可以实现加载更多历史消息的逻辑
        console.log('Load more messages');
      }
    }
  }
  </script>
  
  <style>
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
  
  .send-button, .image-button {
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