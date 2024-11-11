<script>
	// App.vue
export default {
  async onLaunch() {
    const token = uni.getStorageSync('token');
    
    if (token) {
      // 检查 token 是否有效
      const isValid = await this.checkTokenValidity(token);
      if (!isValid) {
        console.log("token 无效，跳转到登录页面");
        this.redirectToLogin();
      } else {
        console.log("token 有效", token);
        // 如果 token 有效，可以继续执行其他初始化逻辑
      }
    } else {
      // 如果没有 token，则跳转到登录页面
      console.log("token 不存在，跳转到登录页面");
      this.redirectToLogin();
    }
  },
  
  methods: {
    async checkTokenValidity(token) {
      // 可选：向后端发送请求验证 token 是否有效
      try {
        const [err, res] = await uni.request({
          url: 'https://your-backend-url.com/api/validate-token',
          method: 'POST',
          data: { token },
          header: {
            'Authorization': `Bearer ${token}`,
          },
        });
        return res?.data?.isValid; // 假设后端返回 isValid 字段
      } catch (error) {
        return false;
      }
    },
    
    redirectToLogin() {
      uni.redirectTo({
        url: '/pages/Login/Login', // 跳转到登录页面
      });
    },
  },
};

</script>

<style>
	/*每个页面公共css */
</style>
