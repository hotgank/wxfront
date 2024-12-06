<template>
  <view class="container">
    <view class="header">
      <text class="title">我的医生</text>
    </view>
    <scroll-view class="doctor-list" scroll-y>
      <view v-for="doctor in doctors" :key="doctor.doctorId" class="doctor-card" @tap="navigateToChat(doctor)">
        <!-- Updated Doctor Card -->
        <image :src="doctor.avatarUrl || '/static/doctor-avatars/default.jpg'" class="doctor-avatar" mode="aspectFill" @tap.stop="navigateToDoctor(doctor)"></image>
        <view class="doctor-info">
          <text class="doctor-name">{{ doctor.name }}</text>
          <text class="doctor-position">{{ doctor.position }}</text>
          <text class="doctor-workplace">{{ doctor.workplace }}</text>
        </view>
        <view class="button-group">
          <!-- Updated End Binding Button -->
          <button class="end-binding-button" @tap.stop="endBinding(doctor)">结束绑定</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>


<script>
import { getMyDoctors } from '@/api/doctor'
import { getDoctorAvatar } from '@/api/image'
import { removeConsultationBinding,marking } from '@/api/relation'
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
      // 结束绑定
      await removeConsultationBinding(doctor.doctorId);
      uni.showToast({
        title: '解除绑定成功',
        icon: 'success',
      });

      // 从列表中移除医生
      this.doctors = this.doctors.filter((d) => d.doctorId !== doctor.doctorId);

      // 结束绑定后，弹出打分界面
      const ratingModal = await uni.showModal({
        title: '为医生评分',
        content: '',
        editable: true, // 启用编辑模式，用户可以输入评分
        placeholderText: '请输入评分 (1-5)',
        confirmText: '提交',
        cancelText: '取消',
      });

      if (ratingModal.confirm) {
        const rating = parseInt(ratingModal.content);
        if (rating >= 1 && rating <= 5) {
          // 调用评分 API
          await marking(doctor.doctorId, rating);
          uni.showToast({
            title: '感谢您的评分',
            icon: 'success',
          });
        } else {
          uni.showToast({
            title: '评分无效，请输入 1-5 的分数',
            icon: 'none',
          });
        }
      }
    }
  } catch (error) {
    uni.showToast({
      title: '解除绑定或评分失败，请稍后重试',
      icon: 'none',
    });
    console.error('解除绑定或评分失败:', error);
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


<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
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
  flex-direction: row;
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.doctor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
}

.doctor-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.doctor-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.doctor-position,
.doctor-workplace {
  font-size: 14px;
  color: #666;
}

.button-group {
  display: flex;
  align-items: center;
}

.end-binding-button {
  padding: 6px 12px;
  background-color: #ff4d4f; /* Matches the Rejected Button Style */
  color: white;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.end-binding-button:active {
  background-color: #d9363e;
}
</style>