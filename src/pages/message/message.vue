<template>
	<view class="container">
	  <view class="header">
		<text class="title">消息</text>
	  </view>
	  <scroll-view class="message-list" scroll-y="true">
		<view v-for="chat in chats" :key="chat.doctor.doctorId" class="chat-card" @tap="navigateToChat(chat.doctor)">
		  <view class="avatar-container">
			<image :src="chat.doctor.avatarUrl" class="doctor-avatar"></image>
			<view v-if="chat.unread" class="unread-indicator">
			  <text class="unread-count">1</text>
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
  </template>
  

<script>
import dayjs from 'dayjs';
import { getLastMessage } from '@/api/message'; // 调用封装好的请求方法
import { getDoctorAvatar } from '../../api/image'; // 调用获取 Base64 格式头像的方法

export default {
  data() {
    return {
      chats: [],
      timer: null,
      MyLatestMessageTime: null
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
            if (avatarUrl) {
              try {
                avatarUrl = await getDoctorAvatar(avatarUrl);
              } catch (error) {
                console.error('获取头像失败:', error);
                avatarUrl = '/static/doctor-avatars/default.jpg';
              }
            } else {
              avatarUrl = '/static/doctor-avatars/default.jpg';
            }

            return {
              doctor: { ...item.doctor, avatarUrl },
              lastMessage: item.message.messageText,
              lastMessageTime: dayjs(item.message.timestamp),
              unread: false,
              senderType: item.message.senderType
            };
          })
        );

        console.log("格式化后的聊天列表:", formattedChats);

        if (formattedChats.length > 0 && this.MyLatestMessageTime !== null) {
          const latestChatTime = formattedChats.reduce((latest, chat) => {
            return chat.lastMessageTime.isAfter(latest) ? chat.lastMessageTime : latest;
          }, dayjs(0));
          
          console.log("最新消息时间:", latestChatTime.format('YYYY-MM-DD HH:mm:ss'));
          console.log("当前记录的最新消息时间:", this.MyLatestMessageTime ? this.MyLatestMessageTime.format('YYYY-MM-DD HH:mm:ss') : '无');

          if (!this.MyLatestMessageTime || latestChatTime.isAfter(this.MyLatestMessageTime)) {
            const hasNewDoctorMessage = formattedChats.some(chat => 
              chat.senderType === 'doctor' && (!this.MyLatestMessageTime || chat.lastMessageTime.isAfter(this.MyLatestMessageTime))
            );

            console.log("是否有新的医生消息:", hasNewDoctorMessage);

            if (hasNewDoctorMessage) {
              this.showNewMessageNotification();
            }

            this.MyLatestMessageTime = latestChatTime;
          }
        } else if(this.MyLatestMessageTime === null){
			this.MyLatestMessageTime = formattedChats.reduce((latest, chat) => {
            return chat.lastMessageTime.isAfter(latest) ? chat.lastMessageTime : latest;
          }, dayjs(0));
		}

        this.chats = formattedChats.map(chat => ({
          ...chat,
          lastMessageTime: chat.lastMessageTime.format('YYYY-MM-DD HH:mm'),
          unread: this.MyLatestMessageTime && chat.lastMessageTime.isAfter(this.MyLatestMessageTime)
        }));


        console.log("更新后的聊天列表:", this.chats);

      } catch (error) {
        console.error('获取消息失败:', error);
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
      }, 15000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    showNewMessageNotification() {
      console.log("显示新消息提醒");
      uni.showToast({
        title: '您有新消息',
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
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  background-image: url('/static/icons/background-message.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  color: whi;
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
