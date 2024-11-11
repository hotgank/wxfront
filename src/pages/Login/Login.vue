<template>
  <view class="container">
    <button type="primary" @tap="handleLogin">微信登录</button>
  </view>
</template>

<script>
import request from '@/utils/request.js';

export default {
  methods: {
    async handleLogin() {
      try {
        // 1. 调用 uni.login 获取 code
        const [error, loginRes] = await uni.login();
        if (error) {
          throw new Error('微信登录失败');
        }

        const { code } = loginRes;

        // 2. 将 code 发送给后端，获取会话令牌
        const [err, response] = await request({
          url: '/api/login', // 假设后端登录 API 路径为 /api/login
          method: 'POST',
          data: { code },
        });

        if (err) {
          throw new Error('登录请求失败');
        }

        if (response.token) {
          // 3. 保存 token
          uni.setStorageSync('token', response.token);

          // 4. 跳转到首页或其他页面
          uni.navigateTo({
            url: '/pages/index/index', // 替换为您的首页路径
          });
        } else {
          throw new Error('登录失败');
        }
      } catch (error) {
        console.error('登录失败：', error);
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none',
        });
      }
    },
  },
};
</script>
