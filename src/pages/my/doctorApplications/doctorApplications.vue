<template>
  <view class="container">
    <view class="header">
      <text class="title">申请医生记录</text>
    </view>
    <scroll-view class="doctor-list" scroll-y="true">
      <view v-for="(doctor, index) in doctors" :key="index" class="doctor-card" @tap="navigateToDoctorInfo(doctor.id)">
        <image :src="doctor.avatar" mode="aspectFill" class="doctor-avatar"></image>
        <view class="doctor-info">
          <text class="doctor-name">{{ doctor.name }}</text>
          <text class="doctor-hospital">{{ doctor.hospital }}</text>
        </view>
        <view :class="['application-status', getStatusClass(doctor.status)]">
          <text>{{ doctor.status }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      doctors: [
        {
          id: 1,
          name: '张医生',
          avatar: '/static/doctor-avatars/doctor1.jpg',
          hospital: '北京协和医院',
          status: '申请中'
        },
        {
          id: 2,
          name: '李医生',
          avatar: '/static/doctor-avatars/doctor2.jpg',
          hospital: '上海瑞金医院',
          status: '已通过'
        },
        {
          id: 3,
          name: '王医生',
          avatar: '/static/doctor-avatars/doctor3.jpg',
          hospital: '广州中山大学附属第一医院',
          status: '已拒绝'
        }
      ]
    }
  },
  methods: {
    navigateToDoctorInfo(doctorId) {
      uni.navigateTo({
        url: `/pages/doctorInfo/doctorInfo?id=${doctorId}`
      });
    },
    getStatusClass(status) {
      switch (status) {
        case '申请中':
          return 'status-pending';
        case '已通过':
          return 'status-approved';
        case '已拒绝':
          return 'status-rejected';
        default:
          return '';
      }
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

.doctor-list {
  flex: 1;
  padding: 10px;
}

.doctor-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.doctor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 15px;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.doctor-hospital {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.application-status {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
}

.status-pending {
  background-color: #ffd700;
  color: #8b6914;
}

.status-approved {
  background-color: #4cd964;
  color: #ffffff;
}

.status-rejected {
  background-color: #ff3b30;
  color: #ffffff;
}
</style>