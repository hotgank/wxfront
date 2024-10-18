<template>
  <view class="container">
    <!-- 第一个板块：测评功能 -->
	<image class= "background-image" src="../../static/icons/background-home.jpg" mode="aspectFill"></image>
    <view class="section evaluation">
      <view class="section-title">测评功能</view>
      <view class="feature-list">
        <view class="feature-item" @click="navigateTo('aiBodyCheck')">
          <image src="/static/icons/body-check.jpg" mode="aspectFit" class="feature-icon"></image>
          <text>AI全面体态检测</text>
        </view>
        <view class="feature-item" @click="navigateTo('spineCheck')">
          <image src="/static/icons/spine-check.jpg" mode="aspectFit" class="feature-icon"></image>
          <text>脊柱健康检测</text>
        </view>
        <view class="feature-item" @click="navigateTo('cobbAngle')">
          <image src="/static/icons/cobb-angle.jpg" mode="aspectFit" class="feature-icon"></image>
          <text>Cobb角测量</text>
        </view>
      </view>
    </view>

    <!-- 第二个板块：咨询医生 -->
    <view class="section consultation">
      <view class="section-title">医生咨询</view>
      <button class="consult-button" @click="navigateTo('doctorConsultation')">
        <image src="/static/icons/doctor.png" mode="aspectFit" class="button-icon"></image>
        咨询医生
      </button>
    </view>

    <!-- 第三个板块：青年百科和科普文章 -->
    <view class="section encyclopedia">
      <view class="section-title">知识板块</view>
      <view class="button-group">
        <button class="custom-button" @click="navigateTo('encyclopedia')">
          <image src="/static/icons/encyclopedia.png" mode="aspectFit" class="button-icon"></image>
          查看青年百科
        </button>
        <button class="custom-button" @click="navigateTo('articles')">
          <image src="/static/icons/article.png" mode="aspectFit" class="button-icon"></image>
          查看科普文章
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      evaluationItems: [
        { icon: 'user-o', text: 'AI全面体态检测', page: 'aiBodyCheck' },
        { icon: 'balance-list-o', text: '脊柱健康检测', page: 'spineCheck' },
        { icon: 'chart-trending-o', text: 'Cobb角测量', page: 'cobbAngle' },
      ]
    }
  },
  methods: {
    navigateTo(page) {
      uni.navigateTo({
        url: `/pages/${page}/${page}`
      });
    }
  }
}
</script>

<style>
.container {
  padding: 10px;
  background-color: #f7f8fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.section {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
}
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;  /* 确保背景图片在内容后面 */
  object-fit: cover;
  opacity: 0.5;  /* 设置透明度，使得内容更加清晰 */
}
.section-title {
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: bold;
}

.feature-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.feature-item {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.feature-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.feature-item text {
  font-size: 14px;
  text-align: center;
}

.custom-button, .consult-button {
  padding: 12px 0;
  font-size: 16px;
}

.button-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

.consultation {
  text-align: center;
}

.consult-button {
  width: 100%;
  background-color: #4cd964;
  color: #ffffff;
}

.button-group {
  display: flex;
  justify-content: space-around;
}

.custom-button {
  flex: 1;
  margin: 0 5px;
  background-color: #007aff;
  color: #ffffff;
}
</style>