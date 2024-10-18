<template>
  <view class="guide-container">
    <view class="guide-title">正确的拍摄姿势</view>
    <view class="guide-item">
      <text>1. 站直，面对相机</text>
    </view>
    <view class="guide-item">
      <text>2. 双臂自然下垂</text>
    </view>
    <view class="guide-item">
      <text>3. 双脚与肩同宽</text>
    </view>
    <view class="guide-item">
      <text>4. 保持自然表情</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PostureGuide'
}
</script>

<style>
.guide-container {
  margin-top: 40rpx;
  padding: 20rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
}

.guide-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.guide-item {
  margin-bottom: 10rpx;
}
</style>