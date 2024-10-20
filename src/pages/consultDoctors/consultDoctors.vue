<template>
  <view class="container">
    <view class="header">
      <text class="title">咨询医生</text>
    </view>
    <scroll-view class="doctor-list" scroll-y="true">
      <view v-for="(doctor, index) in doctors" :key="index" class="doctor-card">
        <image :src="doctor.avatar" mode="aspectFill" class="doctor-avatar" @tap="viewDoctorProfile(doctor.id)"></image>
        <view class="doctor-info">
          <text class="doctor-name">{{ doctor.name }}</text>
          <text class="doctor-title">{{ doctor.title }}</text>
          <text class="doctor-hospital">{{ doctor.hospital }}</text>
        </view>
        <button class="apply-button" @tap="applyDoctor(doctor.id)">申请成为患者</button>
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
          title: '主任医师',
          hospital: '北京协和医院'
        },
        {
          id: 2,
          name: '李医生',
          avatar: '/static/doctor-avatars/doctor2.jpg',
          title: '副主任医师',
          hospital: '上海瑞金医院'
        },
        {
          id: 3,
          name: '王医生',
          avatar: '/static/doctor-avatars/doctor3.jpg',
          title: '主治医师',
          hospital: '广州中山大学附属第一医院'
        }
      ]
    }
  },
  methods: {
    viewDoctorProfile(doctorId) {
      uni.navigateTo({
        url: `/pages/doctorProfile/doctorProfile?id=${doctorId}`
      });
    },
    applyDoctor(doctorId) {
      // 这里应该是向后端发送申请的逻辑
      // 为了演示，我们直接显示申请成功的提示
      uni.showModal({
        title: '申请成功',
        content: '您的申请已提交，请在申请记录中查看申请是否通过。',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            // 可以在这里添加跳转到申请记录页面的逻辑
            // uni.navigateTo({
            //   url: '/pages/applicationRecords/applicationRecords'
            // });
          }
        }
      });
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
  width: 80px;
  height: 80px;
  border-radius: 40px;
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

.doctor-title {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.doctor-hospital {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

.apply-button {
  background-color: #007aff;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 14px;
}
</style>