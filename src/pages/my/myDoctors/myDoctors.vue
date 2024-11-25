<template>
  <view class="container">
    <image class="background-image" src="/static/icons/background-message.jpg" mode="aspectFill"></image>
    <view class="content">
      <view class="header">
        <text class="title">我的医生</text>
      </view>
      <view class="doctor-list">
        <view v-for="doctor in doctors" :key="doctor.doctorId" class="doctor-card">
          <image :src="doctor.avatarUrl || '/static/doctor-avatars/default.jpg'" mode="aspectFill" class="doctor-avatar"
            @tap="navigateToDoctor(doctor)"></image>
          <view class="doctor-info">
            <text class="doctor-name">{{ doctor.name }}</text>
            <text class="doctor-hospital">{{ doctor.workplace }}</text>
            <text class="doctor-specialty">{{ doctor.experience ? doctor.experience : '小白' }}</text>
          </view>
          <button class="end-binding-button" @tap="endBinding(doctor)">结束绑定</button>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
import { getMyDoctors } from '@/api/doctor'
import { getDoctorAvatar } from '@/api/image'
import { removeConsultationBinding } from '@/api/relation'
export default {
  data() {
    return {
      doctors: [
      ]
    }
  },
  mounted() {
    this.fetchDoctors();
  },
  methods: {
    async fetchDoctors() {
      try {
        if (!this.doctors.length) {
          const doctors = await getMyDoctors(); // 获取医生信息
          this.doctors = await Promise.all(
            doctors.map(async (doctor) => {
              if (doctor.avatarUrl) {
                try {
                  const base64Avatar = await getDoctorAvatar(doctor.avatarUrl);
                  doctor.avatarUrl = base64Avatar || doctor.avatarUrl; // 如果请求失败，保留原始 URL
                } catch (error) {
                  console.error(`获取医生 ${doctor.doctorId} 的头像失败`);
                }
              }
              return doctor;
            })
          );
        }
      } catch (error) {
        uni.showToast({
          title: '加载医生信息失败',
          icon: 'none',
        });
      }
    },
    async endBinding(doctor) {
      try {
        const confirmation = await uni.showModal({
          title: '确认操作',
          content: `确定要解除与 ${doctor.name} 的绑定吗？`,
          confirmText: '确定',
          cancelText: '取消',
        });

        if (confirmation.confirm) {
          await removeConsultationBinding(doctor.doctorId); // Call API
          uni.showToast({
            title: '解除绑定成功',
            icon: 'success',
          });

          // Remove doctor from the list
          this.doctors = this.doctors.filter((d) => d.doctorId !== doctor.doctorId);
        }
      } catch (error) {
        uni.showToast({
          title: '解除绑定失败，请稍后重试',
          icon: 'none',
        });
        console.error('解除绑定失败:', error);
      }
    },
    navigateToChat(doctor) {
      uni.navigateTo({
        url: `/pages/doctorChat/doctorChat?doctor=${encodeURIComponent(JSON.stringify(doctor))}`,
      });
    },
    navigateToDoctor(doctor) {
      uni.navigateTo({
        url: `/pages/doctorProfile/doctorProfile?doctor=${encodeURIComponent(JSON.stringify(doctor))}`,
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
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.doctor-list {
  flex: 1;
}

.doctor-card {
  display: flex;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.doctor-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.doctor-hospital {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.doctor-specialty {
  font-size: 14px;
  color: #666;
}

.end-binding-button {
  padding: 5px 10px;
  margin-top: 10px;
  background-color: #f56c6c;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
}
</style>