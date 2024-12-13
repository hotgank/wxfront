<template>
  <view class="container">
    <!-- 聊天头部 -->
    <view class="chat-header">
      <text class="doctor-name">{{ doctor.name }}</text>
    </view>

    <!-- 聊天内容区域 -->
    <scroll-view ref="chatBody" class="chat-body" scroll-y @scrolltoupper="loadMoreMessages"
      @scrolltolower="loadLatestMessages" :scroll-with-animation="true" :refresher-enabled="true"
      :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" :scroll-into-view="scrollIntoView">
      <view v-for="(message) in messages" :key="message.messageSeq" :id="'message-' + message.messageSeq"
        class="message-wrapper">
        <!-- 显示发送时间 -->
        <text class="message-time">{{ message.formattedTime }}</text>

        <!-- 消息行，根据 sendType 调整布局 -->
        <view class="message-row" :class="message.sendType === 'user' ? 'user-row' : 'doctor-row'">
          <!-- 医生发送的消息，头像在左侧 -->
          <template v-if="message.sendType === 'doctor'">
            <image :src="doctor.avatarUrl" class="avatar"></image>
            <view class="message-content doctor-content">
              <image v-if="message.type === 'image'" :src="message.localUrl || message.url" mode="widthFix"
                class="message-image" alt="Message image" @tap="previewImage(message.localUrl || message.url)"></image>
              <text v-else class="message-text">{{ message.content }}</text>
            </view>
          </template>

          <!-- 用户发送的消息，头像在右侧 -->
          <template v-else>
            <view class="message-content user-content">
              <image v-if="message.type === 'image'" :src="message.localUrl || message.url" mode="widthFix"
                class="message-image" alt="Message image" @tap="previewImage(message.localUrl || message.url)"></image>
              <text v-else class="message-text">{{ message.content }}</text>
            </view>
            <image :src="userAvatar" class="avatar"></image>
          </template>
        </view>
      </view>
      <view :id="'bottom-' + bottomId"></view>
    </scroll-view>

    <!-- 聊天输入区域 -->
    <view class="chat-footer">
      <input v-model="inputMessage" class="message-input" type="text" placeholder="输入消息..." @confirm="sendMessage" />
      <button class="image-button" @tap="chooseImage">图片</button>
      <button class="send-button" @tap="sendMessage">发送</button>
    </view>
  </view>
</template>


<script>
import { selectRelationIdByDoctorId } from '@/api/relation';
import {
  getLast30Messages,
  getMessagesBefore,
  getMessagesAfter,
  sendMessageApi,
  updateReadInfo
} from '@/api/message';
import { getDoctorAvatar, uploadChatImageApi } from '@/api/image';
import { getUserInfo } from '@/api/user'; // 导入获取用户信息的 API 方法

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
      scrollIntoView: '',
      bottomId: 0, // 新增计数器
      userAvatar: '/static/user-avatars/user-default.jpg', // 设置默认用户头像
      isRefreshing: false,
      messageSeqBefore: null, // 用于加载历史消息
      messageSeqAfter: null,  // 用于加载最新消息
      loadingMore: false,     // 防止重复加载
      loadingLatest: false,   // 防止重复加载
    };
  },

  // onReady() {
  //   // 在页面加载完成后，滚动到底部
  //   this.$nextTick(() => {
  //     this.scrollIntoView = 'message-' + this.messageSeqAfter;
  //   });
  // },
  async onLoad(option) {
    try {
      if (option.doctor) {
        this.doctor = JSON.parse(decodeURIComponent(option.doctor));
      }
      this.relationId = await selectRelationIdByDoctorId(this.doctor.doctorId);

      // 获取用户信息并设置用户头像
      const userInfo = await getUserInfo();
      if (userInfo && userInfo.avatarUrl) {
        try {
          // 如果需要处理头像 URL（例如转换为 Base64），可以调用相应的方法
          this.userAvatar = await getDoctorAvatar(userInfo.avatarUrl) || userInfo.avatarUrl;
        } catch (error) {
          console.error("获取用户头像失败:", error);
          this.userAvatar = userInfo.avatarUrl; // 保持原始 URL
        }
      }

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
    // 格式化时间戳为可读格式
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      // 可选：添加日期信息
      const year = date.getFullYear();
      const month = (`0${date.getMonth() + 1}`).slice(-2);
      const day = (`0${date.getDate()}`).slice(-2);

      // 返回格式化后的时间，例如 "12/12 9:46 PM"
      return `${month}/${day} ${formattedHours}:${formattedMinutes} ${ampm}`;
    },

    // 初始加载消息
    async fetchMessages() {
      try {
        console.log('开始加载初始化消息');
        const messages = await getLast30Messages(this.relationId);
        console.log('初始消息数据:', messages); // 日志

        const processedMessages = await this.processMessages(messages);
        console.log('处理后的消息:', processedMessages); // 日志

        this.messages = processedMessages.sort((a, b) => a.messageSeq - b.messageSeq);

        // 初始化 messageSeqBefore 和 messageSeqAfter
        this.messageSeqBefore = this.messages[0]?.messageSeq || null;
        this.messageSeqAfter = this.messages[this.messages.length - 1]?.messageSeq || null;

        console.log('messageSeqBefore:', this.messageSeqBefore, 'messageSeqAfter:', this.messageSeqAfter);
        // 在成功加载最新消息后，更新已读消息序列号
        if (this.messageSeqAfter) {
          try {
            await updateReadInfo(this.relationId, this.messageSeqAfter);
            console.log('已更新已读消息序列号:', this.messageSeqAfter);
            this.$nextTick(() => {
              this.scrollIntoView = 'message-' + this.messageSeqAfter;
            });
          } catch (error) {
            console.error('更新已读消息序列号失败:', error);
          }
        }
        
      } catch (error) {
        console.error('加载消息失败:', error);
        uni.showToast({
          title: '加载消息失败，请稍后重试',
          icon: 'none',
        });
      }
    },

    async chooseImage() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0]; // 获取临时图片路径

          // 生成客户端的 timestamp 和 messageSeq
          const currentTimestamp = new Date().toISOString(); // 当前时间戳
          const newMessageSeq = this.messageSeqAfter ? this.messageSeqAfter + 1 : 1;

          // 创建临时图片消息对象
          const newImageMessage = { // 临时路径
            localUrl: tempFilePath,
            sendType: 'user', // 用户发送的消息
            type: 'image',
            url: null, // 后端返回的 URL
            messageSeq: newMessageSeq, // 客户端生成的 messageSeq
            timestamp: currentTimestamp, // 客户端生成的时间戳
            formattedTime: this.formatTime(currentTimestamp),
          };

          // 添加到消息列表中
          this.messages.push(newImageMessage);
          this.messageSeqAfter = newMessageSeq; // 更新最新的 messageSeqAfter
          this.$nextTick(() => {
            this.scrollToBottom();
          });

          try {
            // 上传图片到服务器
            const response = await uploadChatImageApi(tempFilePath, this.relationId);

            if (response && response.imageUrl) {
              // 更新消息对象的 URL
              newImageMessage.url = response.imageUrl;

              // 发送消息到后端
              await sendMessageApi(
                this.relationId,
                'user',
                '[图片]', // 后端存储类型标识
                'image',
                response.imageUrl
              );

              console.log('图片发送成功:', response.imageUrl);
              this.$nextTick(() => {

                this.scrollIntoView = 'bottom-' + this.bottomId; // 设置新的 scrollIntoView
                this.bottomId += 1; // 递增计数器
              });
              // 注意：由于 uploadChatImageApi 不返回 messageSeq 和 timestamp，这里无法更新它们
              // 如果需要从后端获取最新的 messageSeq 和 timestamp，可以考虑调用另一个 API 或重新获取消息列表
            } else {
              throw new Error('图片上传失败，未返回 URL');
            }
          } catch (error) {
            console.error('图片发送失败:', error);
            uni.showToast({
              title: '图片发送失败，请稍后重试',
              icon: 'none',
            });

            // 移除发送失败的临时消息
            const index = this.messages.indexOf(newImageMessage);
            if (index !== -1) {
              this.messages.splice(index, 1);
              // 还原 messageSeqAfter
              this.messageSeqAfter = this.messageSeqAfter > 1 ? this.messageSeqAfter - 1 : 0;
            }
          }
        },
        fail: (err) => {
          console.error('选择图片失败:', err);
          uni.showToast({
            title: '选择图片失败，请稍后重试',
            icon: 'none',
          });
        },
      });
    },

    // 处理消息数据
    async processMessages(messages) {
      return Promise.all(
        messages
          .filter((msg) => msg && msg.messageSeq) // 确保消息有效并包含 messageSeq
          .map(async (msg) => {
            let url = msg.url;
            if (msg.messageType === 'image' && msg.url) {
              try {
                url = await getDoctorAvatar(msg.url); // 获取图片 URL（如果需要处理）
              } catch (error) {
                console.error('加载图片失败:', error);
              }
            }
            return {
              content: msg.messageText,
              sendType: msg.senderType === 'user' ? 'user' : 'doctor', // 根据 senderType 设置 sendType
              url: url,
              type: msg.messageType || 'text', // 默认类型为 'text'
              messageSeq: msg.messageSeq, // 确保 messageSeq 正确设置
              timestamp: msg.timestamp, // 使用后端返回的 timestamp
              formattedTime: this.formatTime(msg.timestamp), // 格式化时间
            };
          })
      );
    },


    // 发送消息
    async sendMessage() {
      if (!this.inputMessage.trim()) return;

      // 生成客户端的 timestamp 和 messageSeq
      const currentTimestamp = new Date().toISOString(); // 当前时间戳
      const newMessageSeq = this.messageSeqAfter ? this.messageSeqAfter + 1 : 1;

      const newMessage = {
        content: this.inputMessage,
        sendType: 'user', // 用户发送的消息
        type: 'text',
        messageSeq: newMessageSeq, // 客户端生成的 messageSeq
        timestamp: currentTimestamp, // 客户端生成的时间戳
        formattedTime: this.formatTime(currentTimestamp),
      };

      this.messages.push(newMessage);
      this.messageSeqAfter = newMessageSeq; // 更新最新的 messageSeqAfter
      this.inputMessage = '';

      this.$nextTick(() => {

        this.scrollIntoView = 'bottom-' + this.bottomId; // 设置新的 scrollIntoView
        this.bottomId += 1; // 递增计数器
      });

      try {
        const response = await sendMessageApi(this.relationId, 'user', newMessage.content);

        console.log('消息发送成功，响应:', response);

        // 假设 sendMessageApi 返回的 response 包含更新后的 messageSeq 和 timestamp
        if (response && response.messageSeq && response.timestamp) {
          // 找到对应的消息并更新其 messageSeq 和 timestamp
          const sentMessage = this.messages.find(msg => msg.messageSeq === newMessageSeq);
          if (sentMessage) {
            sentMessage.messageSeq = response.messageSeq;
            sentMessage.timestamp = response.timestamp;
            sentMessage.formattedTime = this.formatTime(response.timestamp);
          }

          // 更新 messageSeqAfter
          this.messageSeqAfter = response.messageSeq;
          console.log('消息发送成功，后端返回的消息序列号和时间戳:', response.messageSeq, response.timestamp);
        }
      } catch (error) {
        console.error('发送消息失败:', error);
        uni.showToast({
          title: '消息发送失败，请稍后重试',
          icon: 'none',
        });

        // 失败后移除临时消息
        const index = this.messages.indexOf(newMessage);
        if (index !== -1) {
          this.messages.splice(index, 1);
          // 还原 messageSeqAfter
          this.messageSeqAfter = this.messageSeqAfter > 1 ? this.messageSeqAfter - 1 : 0;
        }
      }
    },


    // 加载更多历史消息
    async loadMoreMessages() {
      if (this.loadingMore || !this.messageSeqBefore) return;
      this.loadingMore = true;

      console.log('开始加载历史消息', this.messageSeqBefore);

      try {
        const moreMessages = await getMessagesBefore(this.relationId, this.messageSeqBefore);

        if (moreMessages.length === 0) {
          console.log('没有更多历史消息');
          return; // 如果为空，直接退出
        }

        const processedMessages = await this.processMessages(moreMessages[1]);
        console.log('处理后的历史消息:', processedMessages);

        this.messages = processedMessages
          .sort((a, b) => a.messageSeq - b.messageSeq)
          .concat(this.messages);

        this.messageSeqBefore = this.messages[0]?.messageSeq || this.messageSeqBefore; // 更新序列号
        console.log('更新后的历史消息:', this.messages);
      } catch (error) {
        console.error('加载历史消息失败:', error);
        uni.showToast({
          title: '加载历史消息失败，请稍后重试',
          icon: 'none',
        });
      } finally {
        this.loadingMore = false;
      }
    },

    async loadLatestMessages() {
      console.log('触发了加载最新消息', this.messageSeqAfter);
      if (this.loadingLatest || !this.messageSeqAfter) return;
      console.log('开始加载最新消息');
      this.loadingLatest = true;

      try {
        const latestMessages = await getMessagesAfter(this.relationId, this.messageSeqAfter);

        if (latestMessages.length === 0) {
          console.log('没有新消息');
          return;
        }
        
        // 处理消息数据
        const processedMessages = await this.processMessages(latestMessages[1]);
        
        const newMessages = processedMessages.filter(
          (msg) => msg.messageSeq > this.messageSeqAfter
        );
        console.log('获取到的新消息:', newMessages);
        if (newMessages.length > 0) {
          this.messages = this.messages.concat(
            newMessages.sort((a, b) => a.messageSeq - b.messageSeq)
          );

          this.messageSeqAfter = this.messages[this.messages.length - 1]?.messageSeq || this.messageSeqAfter;
          console.log('加载最新消息成功');

          // 更新已读消息序列号
          if (this.messageSeqAfter) {
            try {
              await updateReadInfo(this.relationId, this.messageSeqAfter);
              console.log('已更新已读消息序列号:', this.messageSeqAfter);
            } catch (error) {
              console.error('更新已读消息序列号失败:', error);
            }
          }
        } else {
          console.log('没有新的消息需要添加');
        }
      } catch (error) {
        console.error('加载最新消息失败:', error);
      } finally {
        this.loadingLatest = false;
      }
    },




    async onRefresh() {
      console.log("触发刷新操作，加载历史消息");
      this.isRefreshing = true; // 开启刷新状态

      try {
        await this.fetchMessages()
      } catch (error) {
        console.error("刷新时加载历史消息失败:", error);
        uni.showToast({
          title: "加载历史消息失败，请稍后重试",
          icon: "none",
        });
      } finally {
        this.isRefreshing = false; // 关闭刷新状态
      }
    },


    // 图片预览
    previewImage(url) {
      uni.previewImage({
        urls: [url],
        current: url,
      });
    },
  },
};
</script>


<style scoped>
/* 容器设置为垂直布局，占满整个视口高度 */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 聊天头部样式 */
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

/* 聊天内容区域样式 */
.chat-body {
  flex: 1;
  padding: 10px;
  background-color: #f0f0f0;
  overflow-y: auto;
}

/* 单条消息包装器 */
.message-wrapper {
  display: flex;
  flex-direction: column;
  /* 使时间和消息内容垂直排列 */
  margin-bottom: 15px;
}

/* 时间戳样式 */
.message-time {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-bottom: 8px;
}

/* 消息行样式 */
.message-row {
  display: flex;
  align-items: flex-end;
}

/* 用户发送的消息行样式 */
.user-row {
  justify-content: flex-end;
}

/* 医生发送的消息行样式 */
.doctor-row {
  justify-content: flex-start;
}

/* 头像样式 */
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

/* 消息内容气泡样式 */
.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 8px;
  word-wrap: break-word;
  position: relative;
  background-color: #fff;
  /* 默认背景色 */
}

/* 用户发送的气泡颜色 */
.user-content {
  background-color: #dcf8c6;
  /* 微信发送消息的绿色 */
  margin-left: 8px;
  /* 与头像分隔 */
}

/* 医生发送的气泡颜色 */
.doctor-content {
  background-color: #fff;
  margin-right: 8px;
  /* 与头像分隔 */
}

/* 消息文本样式 */
.message-text {
  font-size: 16px;
  line-height: 1.4;
}

/* 消息图片样式 */
.message-image {
  max-width: 100%;
  border-radius: 5px;
}

/* 聊天输入区域样式 */
.chat-footer {
  display: flex;
  padding: 10px;
  background-color: #f8f8f8;
  border-top: 1px solid #e0e0e0;
  align-items: center;
}

/* 输入框样式 */
.message-input {
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 18px;
  font-size: 16px;
  background-color: #fff;
}

/* 发送按钮和图片按钮样式 */
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
  cursor: pointer;
}

/* 图片按钮样式 */
.image-button {
  background-color: #4cd964;
}
</style>
