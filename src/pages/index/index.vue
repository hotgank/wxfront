<template>
  <view class="container">
    <image class="background-image" src="/static/icons/background-home.png" mode="aspectFill"></image>
    <view class="content">
      <!-- 第一个板块：测评功能 -->
      <view class="section evaluation">
        <view class="section-title">测评功能</view>
        <view class="feature-list">
          <view class="feature-item" @click="navigateToC('spinal_deviation')">
            <image src="/static/icons/spine-check.png" mode="aspectFit" class="feature-icon"></image>
            <text>脊柱异位检测</text>
          </view>
          <view class="feature-item" @click="navigateToC('uneven_shoulders')">
            <image src="/static/icons/uneven_shoulders.png" mode="aspectFit" class="feature-icon"></image>
            <text>高低肩检测</text>
          </view>
          <view class="feature-item" @click="navigateToC('pelvic_tilt')">
            <image src="/static/icons/pelvic_tilt.png" mode="aspectFit" class="feature-icon"></image>
            <text>骨盆侧倾检测</text>
          </view>
        </view>
      </view>

      <!-- 新增板块：查看报告 -->
      <view class="section reports">
        <view class="section-title">测评报告</view>
        <button class="report-button" @click="navigateToB('evaluationRecords')">
          <image src="/static/my/evaluation-records.png" mode="aspectFit" class="button-icon"></image>
          查看测评记录
        </button>
      </view>

      <!-- 第二个板块：咨询医生 -->
      <view class="section consultation">
        <view class="section-title">医生咨询</view>
        <button class="consult-button" @click="navigateTo('consultDoctors')">
          <image src="/static/icons/doctor.png" mode="aspectFit" class="button-icon"></image>
          咨询医生
        </button>
      </view>

      <!-- 第三个板块：青年百科和科普文章 -->
      <view class="section encyclopedia">
        <view class="section-title">知识板块</view>
        <view class="button-group">
          <button class="custom-button" @click="navigateTo('articles')">
            <image src="/static/icons/article.png" mode="aspectFit" class="button-icon"></image>
            查看科普文章
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import '@/api/testApi';
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
        url: `/pages/index/${page}/${page}`
      });
    },
    navigateToB(page) {
      uni.navigateTo({
        url: `/pages/my/${page}/${page}`
      });
    },
    navigateToC(page) {
      uni.navigateTo({
        url: `/pages/index/aiBodyCheck/aiBodyCheck?type=${page}`
      });
    }
  }
}
</script>

<style>
.container {
  position: relative;
  min-height: 100vh;
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
}

.section {
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.feature-list {
  display: flex;
  justify-content: space-around;
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
  margin-bottom: 5px;
  border-radius: 25px;
}

.feature-item text {
  font-size: 12px;
  text-align: center;
  color: #333;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.custom-button, .consult-button, .report-button {
  flex: 1;
  margin: 0 5px;
  background-color: rgba(0, 122, 255, 0.7);
  color: #ffffff;
  border: none;
  padding: 10px 0;
  border-radius: 5px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.consult-button {
  background-color: rgba(76, 217, 100, 0.7);
}

.report-button {
  background-color: rgba(255, 149, 0, 0.7);
}

.button-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
</style>