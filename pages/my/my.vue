<template>
  <view class="container">
    <image class="background-image" src="/static/my/background.jpg" mode="aspectFill"></image>
    <view class="content">
      <!-- 用户信息部分 -->
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatarUrl" mode="aspectFill"></image>
        <text class="nickname">{{ userInfo.nickName }}</text>
      </view>

      <!-- 功能板块 -->
      <view class="function-blocks">
        <!-- 孩子档案 -->
        <view class="block" @click="navigateTo('childProfile')">
          <image class="block-icon" src="/static/my/child-profile.png" mode="aspectFit"></image>
          <text class="block-title">孩子档案</text>
        </view>

        <!-- 我的医生 -->
        <view class="block" @click="navigateTo('myDoctors')">
          <image class="block-icon" src="/static/my/my-doctors.png" mode="aspectFit"></image>
          <text class="block-title">我的医生</text>
        </view>

        <!-- 申请医生记录 -->
        <view class="block" @click="navigateTo('doctorApplications')">
          <image class="block-icon" src="/static/my/doctor-applications.png" mode="aspectFit"></image>
          <text class="block-title">申请医生记录</text>
        </view>

        <!-- 测评记录 -->
        <view class="block" @click="navigateTo('evaluationRecords')">
          <image class="block-icon" src="/static/my/evaluation-records.png" mode="aspectFit"></image>
          <text class="block-title">测评记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatarUrl: '/static/my/default-avatar.jpg', // 默认头像
        nickName: '微信用户' // 默认昵称
      }
    }
  },
  onLoad() {
    // 获取用户信息
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      // 这里应该是获取微信用户信息的逻辑
      // 由于微信小程序的限制，这里只是一个示例
      // 实际使用时需要根据微信小程序的授权流程来获取用户信息
      // 以下是示例代码，实际使用时需要替换为真实的获取用户信息的逻辑
      uni.getUserInfo({
        success: (res) => {
          this.userInfo = res.userInfo
        },
        fail: (err) => {
          console.error('获取用户信息失败', err)
        }
      })
    },
    navigateTo(page) {
      uni.navigateTo({
        url: `/pages/${page}/${page}`
      })
    }
  }
}
</script>

<style>
.container {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nickname {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.function-blocks {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
}

.block {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.block:active {
  transform: scale(0.98);
}

.block-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.block-title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  text-align: center;
}
</style>