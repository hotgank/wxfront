<template>
  <view class="container">
    <view class="header">
      <image :src="doctor.avatar" mode="aspectFill" class="doctor-avatar"></image>
      <view class="doctor-basic-info">
        <text class="doctor-name">{{ doctor.name }}</text>
        <text class="doctor-position">{{ doctor.position }}</text>
        <text class="doctor-workplace">{{ doctor.workplace }}</text>
      </view>
    </view>
    <view class="content">
      <view class="info-section">
        <text class="section-position">评分</text>
        <view class="rating">
          <text class="rating-score">{{ doctor.rating }}</text>
          <view class="rating-stars">
            <text v-for="i in 5" :key="i" class="star" :class="{ 'filled': i < Math.floor(doctor.rating) }">★</text>
          </view>
        </view>
      </view>
      <view class="info-section">
        <text class="section-position">职位</text>
        <text class="section-content">{{ doctor.position }}</text>
      </view>
      <view class="info-section">
        <text class="section-position">工作经历</text>
        <text class="section-content">{{ doctor.experience }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      doctor: {
        id: '',
        name: '',
        avatar: '',
        workplace: '',
        rating: 0,
        position: '',
        experience: ''
      }
    }
  },
  onLoad(option) {
    // 使用传入的 URL 参数设置医生信息
    this.doctor.id = option.id || '';
    this.doctor.name = decodeURIComponent(option.name) || '未知医生';
    this.doctor.avatar = decodeURIComponent(option.avatarUrl) || '/static/doctor-avatars/default.jpg';
    this.doctor.workplace = decodeURIComponent(option.workplace) || '未知医院';
    this.doctor.position = decodeURIComponent(option.position) || '医生';
    this.doctor.rating = parseFloat(option.rating) || 0;
    this.doctor.experience = decodeURIComponent(option.experience) || '暂无工作经历';
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
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.doctor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.doctor-basic-info {
  display: flex;
  flex-direction: column;
}

.doctor-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.doctor-position {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

.doctor-workplace {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
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

.section-position {
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

.rating {
  display: flex;
  align-items: center;
}

.rating-score {
  font-size: 24px;
  font-weight: bold;
  color: #ff9500;
  margin-right: 10px;
}

.rating-stars {
  display: flex;
}

.star {
  font-size: 20px;
  color: #d1d1d1;
}

.star.filled {
  color: #ff9500;
}
</style>