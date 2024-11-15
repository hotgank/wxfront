<template>
  <view class="container">
    <view class="header">
      <text class="title">咨询医生</text>
    </view>
    <scroll-view class="doctor-list" scroll-y="true">
      <view v-for="(doctor) in doctors" :key="doctor.doctorId " class="doctor-card">
        <image :src="doctor.avatarUrl || '/static/doctor-avatars/default.jpg'" mode="aspectFill" class="doctor-avatar" @tap="viewDoctorProfile(doctor)"></image>
        <view class="doctor-info">
          <text class="doctor-name">{{ doctor.name }}  </text>
          <text class="doctor-title">{{ doctor.position || '医生' }}</text>
          <br>
          <text class="doctor-hospital">{{ doctor.workplace || '未知医院' }}</text>
        </view>
        <button class="apply-button" @tap="applyDoctor(doctor.doctorId)">申请成为患者</button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getAllDoctors } from '@/api/doctor.js';
import { bindDoctorPatientRelation } from '@/api/relation.js';

export default {
  data() {
    return {
      doctors: [] 
    };
  },
  async mounted() {
    await this.loadDoctors();
  },
  methods: {
    async loadDoctors() {
      try {
        const doctors = await getAllDoctors();
        console.log('医生数据:', doctors);
        this.doctors = doctors;
      } catch (error) {
        console.error('加载医生信息失败:', error.message);
        uni.showToast({
          title: '加载医生信息失败',
          icon: 'none'
        });
      }
    },

    viewDoctorProfile(doctor) {
      const url = `/pages/doctorProfile/doctorProfile?id=${doctor.doctorId}&name=${encodeURIComponent(doctor.name)}&position=${encodeURIComponent(doctor.position || '医生')}&workplace=${encodeURIComponent(doctor.workplace || '未知医院')}&avatarUrl=${encodeURIComponent(doctor.avatarUrl || '/static/doctor-avatars/default.jpg')}&rating=${doctor.rating || 0}&experience=${encodeURIComponent(doctor.experience || 0)}`;
      
      uni.navigateTo({
        url: url
      });
    },

    async applyDoctor(doctorId) {
      const childId = 'C-75f9fafb-d539-4acf-ac5f-a1acc379c248'; // 假设 childId 是固定的测试值

      try {
        await bindDoctorPatientRelation(doctorId, childId);
        uni.showModal({
          title: '申请成功',
          content: '您的申请已提交，请在申请记录中查看申请是否通过。',
          showCancel: false
        });
      } catch (error) {
        console.error('绑定关系失败:', error.message);
        uni.showToast({
          title: '申请失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
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
.doctor-name {
  margin-right: 8px;
}
</style>
