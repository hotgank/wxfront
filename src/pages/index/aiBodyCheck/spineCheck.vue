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
      <button class="start-button" @tap="navigateToSelectProfile">开始测评</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detectionType: '脊柱异位检测',
      detectionInfo: '脊柱异位检测是一项用于评估脊柱健康状态的技术，旨在通过分析脊柱形态和排列情况，识别因先天性畸形、外伤、退行性疾病或其他病因导致的脊柱结构异常。该技术广泛应用于临床诊断、康复评估及手术规划，结合医学影像（如X光、CT、MRI）与先进的计算机算法（包括人工智能与机器学习），能够实现高精度的异位区域识别和定位。脊柱异位检测的推广不仅有助于早期发现问题，降低疾病进展的风险，还能为个性化治疗方案提供科学依据。'   }
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