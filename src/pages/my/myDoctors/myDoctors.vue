<template>
  <view class="container">
    <view class="header">
      <text class="title">我的医生</text>
    </view>
    <scroll-view class="doctor-list" scroll-y>
      <view
        v-for="doctor in doctors"
        :key="doctor.doctorId"
        class="doctor-card"
        @tap="navigateToChat(doctor)"
      >
        <!-- 医生头像 -->
        <image
          :src="doctor.avatarUrl || '/static/doctor-avatars/default.jpg'"
          class="doctor-avatar"
          mode="aspectFill"
          @tap.stop="navigateToDoctor(doctor)"
        ></image>
        <!-- 医生信息 -->
        <view class="doctor-info">
          <text class="doctor-name">{{ doctor.name }}</text>
          <text class="doctor-position">{{ doctor.position }}</text>
          <text class="doctor-workplace">{{ doctor.workplace }}</text>
        </view>
        <!-- 按钮组 -->
        <view class="button-group">
          <button class="end-binding-button" @tap.stop="promptRating(doctor)">
            结束绑定
          </button>
        </view>
      </view>
    </scroll-view>

    <!-- 评分模态框 -->
    <view v-if="showRatingModal" class="modal-overlay" @tap="closeRatingModal">
      <view class="modal-content" @tap.stop>
        <text class="modal-title">为医生评分</text>
        <view class="stars">
          <text
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= selectedRating }"
            @tap="setRating(star)"
          >
            &#9733;
          </text>
        </view>
        <view class="modal-buttons">
          <button class="cancel-button" @tap="closeRatingModal">取消</button>
          <button class="submit-button" @tap="submitRating">提交</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getMyDoctors } from '@/api/doctor'
import { getDoctorAvatar } from '@/api/image'
import { removeConsultationBinding, marking } from '@/api/relation'

export default {
  data() {
    return {
      doctors: [],
      showRatingModal: false,       // 控制评分模态框的显示
      selectedDoctor: null,         // 存储选定的医生
      selectedRating: 0,            // 存储选定的评分
    }
  },
  mounted() {
    this.fetchDoctors();
  },
  methods: {
    // 获取医生列表
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
    // 显示评分模态框
    promptRating(doctor) {
      this.selectedDoctor = doctor;
      this.selectedRating = 0;
      this.showRatingModal = true;
    },
    // 关闭评分模态框
    closeRatingModal() {
      this.showRatingModal = false;
      this.selectedDoctor = null;
      this.selectedRating = 0;
    },
    // 设置评分
    setRating(rating) {
      this.selectedRating = rating;
    },
    // 提交评分
    async submitRating() {
      if (this.selectedRating < 1 || this.selectedRating > 5) {
        uni.showToast({
          title: '请选择一个评分',
          icon: 'none',
        });
        return;
      }

      try {
        const doctor = this.selectedDoctor;

        // 结束绑定
        await removeConsultationBinding(doctor.doctorId);
        uni.showToast({
          title: '解除绑定成功',
          icon: 'success',
        });

        // 从列表中移除医生
        this.doctors = this.doctors.filter((d) => d.doctorId !== doctor.doctorId);

        // 提交评分
        await marking(doctor.doctorId, this.selectedRating);
        uni.showToast({
          title: '感谢您的评分',
          icon: 'success',
        });

      } catch (error) {
        uni.showToast({
          title: '解除绑定或评分失败，请稍后重试',
          icon: 'none',
        });
        console.error('解除绑定或评分失败:', error);
      } finally {
        this.closeRatingModal();
      }
    },
    // 导航到聊天页面
    navigateToChat(doctor) {
      uni.navigateTo({
        url: `/pages/doctorChat/doctorChat?doctor=${encodeURIComponent(JSON.stringify(doctor))}`,
      });
    },
    // 导航到医生详情页面
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
  background-color: #ff4d4f; /* 红色按钮 */
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

/* 评分模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 80%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.modal-title {
  font-size: 18px;
  margin-bottom: 20px;
}

.stars {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.star {
  font-size: 30px;
  color: #ccc;
  margin: 0 5px;
  cursor: pointer;
  transition: color 0.2s;
}

.star.filled {
  color: #f5a623; /* 高亮颜色 */
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
}

.cancel-button,
.submit-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

.cancel-button {
  background-color: #ccc;
  color: #fff;
}

.submit-button {
  background-color: #4CAF50;
  color: #fff;
}

.cancel-button:active {
  background-color: #999;
}

.submit-button:active {
  background-color: #45a049;
}
</style>
