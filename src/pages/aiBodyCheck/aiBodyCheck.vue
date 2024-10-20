<template>
  <view class="container">
    <view class="header">
      <text class="title">{{ detectionType }}</text>
    </view>
    <view class="content">
      <view class="info-section">
        <text class="section-title">项目简介</text>
        <text class="section-content">{{ detectionInfo }}</text>
      </view>
      <button class="start-button" @tap="navigateToSelectProfile">选择档案进行测评</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detectionType: 'AI全面体态检测',
      detectionInfo: 'AI全面体态检测是一种先进的检测方法，通过人工智能技术分析您的体态照片，提供全面的体态评估报告。这种检测可以帮助识别潜在的姿势问题，如脊柱侧弯、驼背等，并为改善体态提供专业建议。'
    }
  },
  methods: {
    navigateToSelectProfile() {
      uni.navigateTo({
        url: `/pages/selectProfile/selectProfile?type=${this.detectionType}`
      });
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.content {
  flex: 1;
  padding: 20px;
}

.info-section {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.section-content {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

.start-button {
  background-color: #007aff;
  color: #ffffff;
  padding: 15px;
  border-radius: 5px;
  font-size: 18px;
  text-align: center;
}
</style>