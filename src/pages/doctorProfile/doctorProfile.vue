<template>
  <view class="container">
    <view class="header">
      <image :src="doctor.avatarUrl || '/static/doctor-avatars/default.jpg'" mode="aspectFill" class="doctor-avatar"></image>
      <view class="doctor-basic-info">
        <text class="doctor-name">{{ doctor.name }}</text>
        <text class="doctor-position">{{ doctor.position || '主治医师' }}</text>
        <text class="doctor-workplace">{{ doctor.workplace }}</text>
      </view>
    </view>
    <view class="content">
      <view class="info-section">
        <text class="section-position">评分</text>
        <view class="rating">
          <text v-if="doctor.rating === -1" class="rating-score">暂无评分</text>
          <view v-else>
            <text class="rating-score">{{ doctor.rating.toFixed(1) }}</text>
            <view class="rating-stars">
              <text 
                v-for="(type, index) in starTypes" 
                :key="index" 
                class="star" 
                :class="type"
              >
                ★
              </text>
            </view>
          </view>
        </view>
      </view>
      <view class="info-section">
        <text class="section-position">职位</text>
        <text class="section-content">{{ doctor.position || '医生' }}</text>
      </view>
      <view class="info-section">
        <text class="section-position">工作经历</text>
        <text class="section-content">{{ doctor.experience || '是一位经验丰富的小白' }}</text>
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
        avatarUrl: '',
        workplace: '',
        rating: 0,
        position: '',
        experience: ''
      }
    }
  },
  computed: {
    starTypes() {
      const types = [];
      if (this.doctor.rating === -1) {
        return types;
      }
      const fullStars = Math.floor(this.doctor.rating);
      const decimal = this.doctor.rating % 1;
      const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
      const additionalFullStar = decimal >= 0.75 ? 1 : 0;

      for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
          types.push('filled');
        } else if (i === fullStars + 1 && hasHalfStar) {
          types.push('half-filled');
        } else if (i === fullStars + 1 && additionalFullStar) {
          types.push('filled');
        } else {
          types.push('empty');
        }
      }
      return types;
    }
  },
  onLoad(option) {
    if (option.doctor) {
      try {
        this.doctor = JSON.parse(decodeURIComponent(option.doctor));
      } catch (error) {
        console.error('医生数据解析失败:', error);
        uni.showToast({
          title: '加载医生数据失败',
          icon: 'none',
        });
      }
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
  position: relative;
}

.star {
  font-size: 20px;
  color: #d1d1d1;
  position: relative;
}

.star.filled {
  color: #ff9500;
}

.star.half-filled {
  color: #d1d1d1;
}

.star.half-filled::before {
  content: '★';
  color: #ff9500;
  position: absolute;
  left: 0;
  width: 50%;
  overflow: hidden;
}
</style>
