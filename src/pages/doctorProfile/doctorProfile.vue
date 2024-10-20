<template>
  <view class="container">
    <view class="header">
      <image :src="doctor.avatar" mode="aspectFill" class="doctor-avatar"></image>
      <view class="doctor-basic-info">
        <text class="doctor-name">{{ doctor.name }}</text>
        <text class="doctor-title">{{ doctor.title }}</text>
        <text class="doctor-hospital">{{ doctor.hospital }}</text>
      </view>
    </view>
    <view class="content">
      <view class="info-section">
        <text class="section-title">评分</text>
        <view class="rating">
          <text class="rating-score">{{ doctor.rating }}</text>
          <view class="rating-stars">
            <text v-for="i in 5" :key="i" class="star" :class="{ 'filled': i <= Math.floor(doctor.rating) }">★</text>
          </view>
        </view>
      </view>
      <view class="info-section">
        <text class="section-title">职位</text>
        <text class="section-content">{{ doctor.position }}</text>
      </view>
      <view class="info-section">
        <text class="section-title">工作经历</text>
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
        id: 1,
        name: '张医生',
        avatar: '/static/doctor-avatars/doctor1.jpg',
        title: '主任医师',
        hospital: '北京协和医院',
        rating: 4.8,
        position: '骨科主任',
        experience: '张医生有超过20年的骨科临床经验。他在脊柱侧弯治疗和矫正方面有着丰富的经验。曾在美国进修两年，专攻脊柱畸形矫正手术。回国后，他在北京协和医院骨科担任主任职务，带领团队完成了数千例成功的脊柱手术。'
      }
    }
  },
  onLoad(option) {
    // 在实际应用中，这里应该根据传入的 id 从后端获取医生信息
    // const doctorId = option.id;
    // this.loadDoctorInfo(doctorId);
  },
  methods: {
    loadDoctorInfo(doctorId) {
      // 这里应该是从后端获取医生信息的逻辑
      // 例如：
      // uni.request({
      //   url: 'your-api-url',
      //   data: { id: doctorId },
      //   success: (res) => {
      //     this.doctor = res.data;
      //   }
      // });
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

.doctor-title {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

.doctor-hospital {
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