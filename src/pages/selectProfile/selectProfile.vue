<template>
  <view class="container">
    <view class="header">
      <text class="title">选择档案</text>
    </view>
    <scroll-view class="profile-list" scroll-y="true">
      <view v-for="(profile, index) in profiles" :key="index" class="profile-card" @tap="selectProfile(profile.childId)">
        <view class="profile-info">
          <text class="profile-name">{{ profile.name }}</text>
          <text class="profile-details">{{ profile.age }}岁 | {{ profile.gender }} | {{ profile.weight }}kg | {{ profile.height }}cm</text>
        </view>
        <view class="profile-actions">
          <button class="action-button select" @tap.stop="selectProfile(profile.childId)">选择</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getAllChildrenProfiles, getChildDetails } from '@/api/child.js';
export default {
  
  data() {
    return {
      detectionType: '',
      profiles: []
    }
  },
  async mounted() {
    await this.loadChildrenProfiles();
  },
  onLoad(option) {
    this.detectionType = option.type;
  },
  methods: {
    async loadChildrenProfiles() {
      try {
        const basicProfiles = await getAllChildrenProfiles();
        const detailedProfiles = await Promise.all(
          basicProfiles.map(async (profile) => {
            const details = await getChildDetails(profile.childId);
            const age = this.calculateAge(details.birthdate);
            const childId = profile.childId;
            return { ...details, relationId: profile.relationId, age, childId: childId };
          })
        );
        this.profiles = detailedProfiles.sort((a, b) => a.relationId - b.relationId);
        console.log('Children profiles:', detailedProfiles);
      } catch (error) {
        console.error('加载孩子档案失败:', error.message);
        uni.showToast({
          title: '加载孩子档案失败',
          icon: 'none'
        });
      }
    },
    calculateAge(birthdate) {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    selectProfile(childId) {
      uni.navigateTo({
        url: `/pages/uploadPhotos/uploadPhotos?type=${this.detectionType}&childId=${childId}`
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