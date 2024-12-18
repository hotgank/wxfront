<template>
  <view class="container">
    <!-- 背景图片 -->
    <image class="background-image" src="/static/icons/background-message2.jpg" mode="aspectFill"></image>
    
    <!-- 内容层 -->
    <view class="overlay">
      <view class="header">
        <text class="title">消息</text>
      </view>
      <scroll-view class="message-list" scroll-y="true">
        <view v-for="chat in chats" :key="chat.doctor.doctorId" class="chat-card" @tap="navigateToChat(chat.doctor)">
          <view class="avatar-container">
            <image :src="chat.doctor.avatarUrl || '/static/doctor-avatars/default.jpg'" class="doctor-avatar"></image>
            <view v-if="chat.unreadCount > 0" class="unread-indicator">
              <text class="unread-count">{{ chat.unreadCount }}</text>
            </view>
          </view>
          <view class="chat-info">
            <view class="chat-header">
              <text class="doctor-name">{{ chat.doctor.name }}</text>
              <text class="last-message-time">{{ chat.lastMessageTime }}</text>
            </view>
            <text class="last-message" :class="{ 'unread': chat.unread }">{{ chat.lastMessage }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>


<script>
import dayjs from 'dayjs';
import { getLastMessage, getUnreadInfo } from '@/api/message';
import { getDoctorAvatar } from '../../api/image';

export default {
  data() {
    return {
      chats: [],
      timer: null,
      MyLatestMessageTime: null,
      unreadCounts: {} // 新增：存储每个医生的未读消息数量
    };
  },
  methods: {
    async fetchMessages() {
      try {
        console.log("获取消息列表");
        const data = await getLastMessage();

        const formattedChats = await Promise.all(
            data.map(async (item) => {
              let avatarUrl = item.doctor.avatarUrl;
              if (!avatarUrl) {
                avatarUrl = '/static/doctor-avatars/default.jpg';
              } else {
                
              }

              // 获取未读消息数量
              const unreadInfo = await this.getUnreadCount(item.message.relationId);

              return {
                doctor: { ...item.doctor, avatarUrl },
                lastMessage: item.message.messageText,
                lastMessageTime: dayjs(item.message.timestamp),
                unread: unreadInfo.UserUnread > 0, // 根据未读消息数量设置 unread 状态
                unreadCount: unreadInfo.UserUnread, // 存储未读消息数量
                senderType: item.message.senderType
              };
            })
        );

        console.log("格式化后的聊天列表:", formattedChats);

        // 更新 MyLatestMessageTime 逻辑保持不变

        this.chats = formattedChats.map(chat => ({
          ...chat,
          lastMessageTime: chat.lastMessageTime.format('YYYY-MM-DD HH:mm'),
        }));

        console.log("更新后的聊天列表:", this.chats);

        // 检查是否有新的未读消息
        const totalUnread = this.chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
        if (totalUnread > 0) {
          //this.showNewMessageNotification(totalUnread);
        }

      } catch (error) {
        console.error('获取消息失败:', error);
      }
    },

    async getUnreadCount(relationId) {
      try {
        const unreadInfo = await getUnreadInfo(relationId);
        return unreadInfo;
      } catch (error) {
        console.error('获取未读消息数量失败:', error);
        return { UserUnread: 0, DoctorUnread: 0 };
      }
    },
    navigateToChat(doctor) {
      try {
        console.log("导航到聊天页面，传递的 doctor 对象:", doctor);
        const encodedDoctor = encodeURIComponent(JSON.stringify(doctor));
        uni.navigateTo({
          url: `/pages/doctorChat/doctorChat?doctor=${encodedDoctor}`
        });
      } catch (error) {
        console.error("Error encoding doctor object:", error);
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.fetchMessages();
      }, 5000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    showNewMessageNotification(count) {
      console.log(`显示新消息提醒: ${count} 条未读消息`);
      uni.showToast({
        title: `您有 ${count} 条新消息`,
        icon: 'none',
        duration: 2000
      });
    }
  },
	
	async onShow() {
		console.log('页面显示，onShow 被触发');
    await this.fetchMessages(); // 页面显示时立即获取一次消息
    if (this.timer === null) {
		 console.log("定时器为空，开始计时");
      this.startTimer(); // 如果定时器为空，则开始计时
    }
  },
  onHide() {
	console.log('页面卸载，onHide 被触发');
    //this.stopTimer(); // 停止定时器
  },
  onUnload() {
	console.log('页面卸载，onUnload 被触发');
    //this.stopTimer(); // 页面卸载时停止定时器
  }
};
</script>




<style>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgba(245, 245, 245, 0.8); /* 半透明覆盖层 */
 
}

.header {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.chat-card {
  display: flex;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #e0e0e0;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  position: relative;
  margin-right: 15px;
}

.doctor-avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  object-fit: cover; /* 确保图片按比例缩放 */
}

.unread-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4d4f;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.unread-count {
  color: white;
  font-size: 12px;
  line-height: 1;
}

.chat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.doctor-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.last-message-time {
  font-size: 12px;
  color: #999;
}

.last-message {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread {
  font-weight: bold;
  color: #333;
}
</style>
