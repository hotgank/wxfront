<template>
	<view class="container">
		<view class="header">
			<text class="title">消息</text>
		</view>
		<scroll-view class="message-list" scroll-y="true">
			<view v-for="chat in chats" :key="chat.doctor.doctorId" class="chat-card" @tap="navigateToChat(chat.doctor)">
				<image :src="chat.doctor.avatarUrl" class="doctor-avatar"></image>
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
			chats: [] // 初始化为空数组，用于存储从后端获取的数据
		};
	},
	methods: {
		async fetchMessages() {
			try {
				const data = await getLastMessage(); // 调用封装的请求方法

				// 格式化返回数据，并异步处理头像的 Base64 转换
				this.chats = await Promise.all(
					data.map(async (item) => {
						let avatarUrl = item.doctor.avatarUrl;
						if (avatarUrl) {
							try {
								// 获取 Base64 格式的头像
								avatarUrl = await getDoctorAvatar(avatarUrl);
							} catch (error) {
								console.error('获取头像失败:', error);
								avatarUrl = '/static/doctor-avatars/default.jpg'; // 使用默认头像
							}
						} else {
							avatarUrl = '/static/doctor-avatars/default.jpg'; // 如果没有头像，设置为默认头像
						}

						return {
							doctor: { ...item.doctor, avatarUrl },
							lastMessage: item.message.messageText,
							lastMessageTime: dayjs(item.message.timestamp).format('YYYY-MM-DD HH:mm'),
							unread: false // 可根据业务逻辑修改
						};
					})
				);
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
		}

	},
	onLoad() {
		this.fetchMessages(); // 组件加载时调用 API 获取数据
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
	/* 背景图 */
	background-size: cover;
	/* 背景图片覆盖整个界面 */
	background-position: center;
	/* 图片居中显示 */
	background-repeat: no-repeat;
	/* 防止图片重复 */
}

.header {
	background-color: rgba(255, 255, 255, 0.8);
	/* 设置半透明背景色 */
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
	/* 设置半透明背景色 */
	border-bottom: 1px solid #e0e0e0;
	border-radius: 10px;
	/* 可选：使卡片有圆角效果 */
	margin-bottom: 10px;
	/* 给卡片之间增加一些间距 */
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	/* 可选：增加阴影效果 */
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