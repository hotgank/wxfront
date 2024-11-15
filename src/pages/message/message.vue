<template>
	<view class="container">
	  <view class="header">
		<text class="title">消息</text>
	  </view>
	  <scroll-view class="message-list" scroll-y="true">
		<view v-for="(chat, index) in chats" :key="index" class="chat-card" @tap="navigateToChat(chat.doctorId)">
		  <image :src="chat.doctorAvatar" class="doctor-avatar"></image>
		  <view class="chat-info">
			<view class="chat-header">
			  <text class="doctor-name">{{ chat.doctorName }}</text>
			  <text class="last-message-time">{{ chat.lastMessageTime }}</text>
			</view>
			<text class="last-message" :class="{ 'unread': chat.unread }">{{ chat.lastMessage }}</text>
		  </view>
		</view>d
	  </scroll-view>
	</view>
  </template>
  
  <script>
  import dayjs from 'dayjs';
  
  export default {
	data() {
	  return {
		chats: [
		  {
			doctorId: 1,
			doctorName: '张医生',
			doctorAvatar: '/static/doctor-avatars/default.jpg',
			lastMessage: '好的，我明白了。您可以先...',
			lastMessageTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
			unread: false
		  },
		  {
			doctorId: 2,
			doctorName: '李医生',
			doctorAvatar: '/static/doctor-avatars/default.jpg',
			lastMessage: '您的最新检查结果已经出来了',
			lastMessageTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm'),
			unread: true
		  },
		  {
			doctorId: 3,
			doctorName: '王医生',
			doctorAvatar: '/static/doctor-avatars/default.jpg',
			lastMessage: '请记得按时服药，如有不适随时联系我',
			lastMessageTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm'),
			unread: false
		  }
		]
	  }
	},
	methods: {
	  navigateToChat(doctorId) {
		// 将该对话的未读状态标记为已读
		const chat = this.chats.find(c => c.doctorId === doctorId);
		if (chat) {
		  chat.unread = false;
		}
		uni.navigateTo({
		  url: `/pages/doctorChat/doctorChat?id=${doctorId}`
		});
	  }
	}
  }
  </script>
  
  <style>
  .container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f5f5;
	background-image: url('/static/icons/background-message.jpg'); /* 背景图 */
	background-size: cover; /* 背景图片覆盖整个界面 */
	background-position: center; /* 图片居中显示 */
	background-repeat: no-repeat; /* 防止图片重复 */
  }
  
  .header {
	background-color: rgba(255, 255, 255, 0.8); /* 设置半透明背景色 */
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
  background-color: rgba(255, 255, 255, 0.8); /* 设置半透明背景色 */
  border-bottom: 1px solid #e0e0e0;
  border-radius: 10px; /* 可选：使卡片有圆角效果 */
  margin-bottom: 10px; /* 给卡片之间增加一些间距 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 可选：增加阴影效果 */
}

.doctor-avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 15px;
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
  