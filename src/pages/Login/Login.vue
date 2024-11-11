<template>
  <view class="container">
    <button @tap="handleLogin">微信登录</button>
  </view>
</template>

<script>
import request from '@/utils/request.js'; // 假设您已在 utils 中封装 request 方法

export default {
  methods: {
    async handleLogin() {
      try {
        // 1. 调用 uni.login 获取 code
        const [loginError, loginRes] = await uni.login();
        if (loginError) throw new Error('微信登录失败');

        const code = loginRes.code;

        // 2. 获取用户信息（可能需要用户授权）
        const [userInfoError, userInfoRes] = await uni.getUserProfile({
          desc: '用于完善会员资料' // 描述用户信息用途
        });
        if (userInfoError) throw new Error('获取用户信息失败');

        const { encryptedData, iv } = userInfoRes;

        // 3. 将 code、encryptedData 和 iv 发送到后端
        const [requestError, response] = await request({
          url: '/api/userLogin/weChatUserLogin',
          method: 'POST',
          data: {
            appId: 'yourAppId', // 若有必要
            appSecret: 'yourAppSecret', // 若有必要，不建议直接放到前端
            code: code,
            encryptedData: encryptedData,
            iv: iv
          }
        });

        if (requestError) throw new Error('登录请求失败');

        // 后端返回的 openid 和 token
        const { openid, token } = response.data;
        uni.setStorageSync('token', token); // 将 token 存储到本地
        console.log('登录成功', openid, token);

        // 跳转到首页或其他页面
        uni.navigateTo({
          url: '/pages/home/home'
        });
      } catch (error) {
        console.error(error.message);
        uni.showToast({
          title: error.message,
          icon: 'none'
        });
      }
    }
  }
};
</script>
