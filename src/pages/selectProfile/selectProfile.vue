<template>
  <view class="container">
    <view class="header">
      <text class="title">选择档案</text>
    </view>
    <scroll-view class="profile-list" scroll-y="true">
      <view v-for="(profile, index) in profiles" :key="index" class="profile-card" @tap="selectProfile(profile.id)">
        <view class="profile-info">
          <text class="profile-name">{{ profile.name }}</text>
          <text class="profile-details">{{ profile.age }}岁 | {{ profile.gender }} | {{ profile.weight }}kg | {{ profile.height }}cm</text>
        </view>
        <view class="profile-actions">
          <button class="action-button select" @tap.stop="selectProfile(profile.id)">选择</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detectionType: '',
      profiles: [
        { id: 1, name: '小明', age: 8, gender: '男', weight: 25.5, height: 130 },
        { id: 2, name: '小红', age: 6, gender: '女', weight: 20.0, height: 115 },
        { id: 3, name: '小华', age: 10, gender: '男', weight: 35.0, height: 145 }
      ]
    }
  },
  onLoad(option) {
    this.detectionType = option.type;
  },
  methods: {
    selectProfile(profileId) {
      uni.navigateTo({
        url: `/pages/uploadPhotos/uploadPhotos?type=${this.detectionType}&profileId=${profileId}`
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
}

.header {
  padding: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.profile-list {
  flex: 1;
  padding: 10px;
}

.profile-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.profile-details {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.profile-actions {
  display: flex;
}

.action-button {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  margin-left: 10px;
}

.select {
  background-color: #4cd964;
  color: #ffffff;
}
</style>