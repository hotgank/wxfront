<template>
  <view class="container">
    <button @tap="info">微信登录</button>
  </view>
</template>

<script>
import request from '@/utils/request.js';

export default {
  methods: {
    async info() {
      try {
        // 1. 调用 wx.login 获取 code
        const loginRes = await new Promise((resolve, reject) => {
          wx.login({
            success: resolve,
            fail: reject
          });
        });

        if (!loginRes.code) {
          throw new Error('微信登录失败');
        }

        const code = loginRes.code;

        // 2. 获取用户信息
        const userInfoRes = await new Promise((resolve, reject) => {
          wx.getUserInfo({
            success: resolve,
            fail: reject
          });
        });

        const { encryptedData, iv, userInfo } = userInfoRes;

        console.log('用户信息:', userInfo);

        // 3. 将 code、encryptedData 和 iv 发送到后端进行验证
        const response = await request({
          url: '/api/userLogin/weChatUserLogin',
          method: 'POST',
          data: {
            code: code,
            encryptedData: encryptedData,
            iv: iv
          }
        });

        if (response[0]) {
          throw new Error('登录请求失败');
        }

        const { token } = response[1]; // 从后端返回的数据中获取 token
        uni.setStorageSync('token', token); // 将 token 存储到本地
        console.log('登录成功, token:', token);

        // 跳转到首页或其他页面
        uni.switchTab({
          url: '/pages/index/index' // 请替换为您的首页路径
        });
      } catch (error) {
        console.error('登录失败:', error.message);
        uni.showToast({
          title: error.message || '登录失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>
