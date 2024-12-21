<template>
  <view class="container">
    <!-- Navigation Bar -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="nav-title"></text>
      </view>
    </view>
    <!-- Main Content -->
    <view class="content-wrapper">
      <view class="content">
        <!-- Logo Section -->
        <view class="logo-section">
          <image src="/static/logo.png" mode="aspectFit" class="logo logo-image" />
          <text class="app-name">体态宝</text>
        </view>

        <!-- Permissions Text -->
        <view class="permission-section">
          <text class="permission-title">登录后开发者将获得以下权限</text>
          <text class="permission-item">• 获得你的公开信息（昵称、头像等）</text>
        </view>

        <!-- Login Button -->
        <button @tap="handleLogin" class="login-button">
          确认登录
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request.js';
import {login} from '@/api/login.js';
export default {
  methods: {
    async handleLogin() {
      try {
        const { token } = await login();
        // 登录成功后可以执行其他逻辑，比如跳转页面
        uni.switchTab({
          url: '/pages/index/index' // 请替换为您的首页路径
        });
      } catch (error) {
        uni.showToast({
          title: error.message || '登录失败，账户已被封禁,或服务器出现问题',
          icon: 'none'
        });
      }
    }
  //   async info() {
  //     try {
  //       // 1. 调用 wx.login 获取 code
  //       const loginRes = await new Promise((resolve, reject) => {
  //         wx.login({
  //           success: resolve,
  //           fail: reject
  //         });
  //       });

  //       if (!loginRes.code) {
  //         throw new Error('微信登录失败');
  //       }

  //       const code = loginRes.code;

  //       // 2. 获取用户信息
  //       const userInfoRes = await new Promise((resolve, reject) => {
  //         wx.getUserInfo({
  //           success: resolve,
  //           fail: reject
  //         });
  //       });

  //       const { encryptedData, iv, userInfo } = userInfoRes;

  //       console.log('用户信息:', userInfo);

  //       // 3. 将 code、encryptedData 和 iv 发送到后端进行验证
  //       const response = await request({
  //         url: '/api/userLogin/weChatUserLogin',
  //         method: 'POST',
  //         data: {
  //           code: code,
  //           encryptedData: encryptedData,
  //           iv: iv
  //         }
  //       });

  //       if (response[0]) {
  //         throw new Error('登录请求失败');
  //       }

  //       const { token } = response[1]; // 从后端返回的数据中获取 token
  //       const expiryTime = Date.now() + 5 * 60 * 60 * 1000; // 5 minutes expiry
  //       uni.setStorageSync('token', token); // 将 token 存储到本地
  //       uni.setStorageSync('token_expiry', expiryTime);

  //       console.log('登录成功, token:', token);

  //       // 跳转到首页或其他页面
  //       uni.switchTab({
  //         url: '/pages/index/index' // 请替换为您的首页路径
  //       });
  //     } catch (error) {
  //       console.error('登录失败:', error.message);
  //       uni.showToast({
  //         title: error.message || '登录失败，请重试',
  //         icon: 'none'
  //       });
  //     }
  //   }
  
   }
};
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #ffffff;
}

.nav-bar {
  padding: 44px 16px 8px;
  background-color: #ffffff;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
}

.nav-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.content-wrapper {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10vh;
  animation: fadeIn 0.5s ease-out;
}

.content {
  /* other styles remain unchanged */
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.logo-image {
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

.app-name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.permission-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.permission-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
}

.permission-item {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.login-button {
  width: 90%;
  height: 44px;
  line-height: 44px;
  background: #07c160;
  color: #ffffff;
  font-size: 16px;
  border-radius: 4px;
  border: none;
  text-align: center;
  margin-top: 20px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.login-button:hover {
  background-color: #1ea350;
}

.login-button:active {
  transform: scale(0.98);
  opacity: 0.8;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>