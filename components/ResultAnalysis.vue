<template>
  <view class="analysis-container">
    <view class="analysis-title">体态分析结果</view>
    <view v-if="analysis">
      <view class="analysis-item">
        <text>总体得分: {{ analysis.overallScore }}</text>
      </view>
      <view class="analysis-item">
        <text>头部位置: {{ analysis.headPosition }}</text>
      </view>
      <view class="analysis-item">
        <text>肩部对齐: {{ analysis.shoulderAlignment }}</text>
      </view>
      <view class="analysis-item">
        <text>脊柱对齐: {{ analysis.spineAlignment }}</text>
      </view>
      <view class="analysis-item">
        <text>臀部对齐: {{ analysis.hipAlignment }}</text>
      </view>
    </view>
    <view v-else>
      <text>正在分析...</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ResultAnalysis',
  props: {
    analysis: Object
  }
}
</script>

<style>
.analysis-container {
  margin-top: 40rpx;
  padding: 20rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
  width: 100%;
}

.analysis-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.analysis-item {
  margin-bottom: 10rpx;
}
</style>