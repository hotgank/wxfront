<script>
	// App.vue
export default {
  async onLaunch() {
    const token = uni.getStorageSync('token');
    const tokenExpiry = uni.getStorageSync('token_expiry');
    // this.clearToken();//清理token
    if (token && tokenExpiry) {
      // 检查 token 是否过期
      
      const isExpired = Date.now() > tokenExpiry;
      if (isExpired) {
        console.log("token 已过期，跳转到登录页面");
        this.clearToken();
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
    clearToken() {
      uni.removeStorageSync('token');
      uni.removeStorageSync('token_expiry');
    },
    
    redirectToLogin() {
      uni.redirectTo({
        url: '/pages/Login/Login', // 跳转到登录页面
      });
    }
  }
};

</script>

<style>
	/*每个页面公共css */
</style>
