<template>
  <view class="container">
    <view class="header">
      <text class="title">申请医生记录</text>
    </view>
    <scroll-view class="doctor-list" scroll-y="true">
      <view v-for="(doctor) in doctors" :key="doctor.doctorId" class="doctor-card" @tap="navigateToDoctorInfo(doctor)">
        <image :src="doctor.avatarUrl || '/static/doctor-avatars/default.jpg'" mode="aspectFill" class="doctor-avatar">
        </image>
        <view class="doctor-info">
          <text class="doctor-name">{{ doctor.name }}</text>
          <text class="doctor-hospital">---{{ doctor.workplace }}</text>
        </view>
        <view :class="['application-status', getStatusClass(doctor.status)]">
          <text>{{ doctor.status }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getSelectApplication } from '@/api/relation'; // 动态请求方法
import { getDoctorAvatar } from '@/api/image';

export default {
  data() {
    return {
      doctors: []
    };
  },
  mounted() {
    this.fetchDoctors();
  },
  methods: {
    async fetchDoctors() {
      const [error, data] = await getSelectApplication();
      if (error) {
        uni.showToast({
          title: '加载失败，请稍后再试',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      this.doctors = await Promise.all(
        data.map(async (item) => {
          const doctor = {
            doctorId: item.doctor.doctorId,
            name: item.doctor.name || item.doctor.username,
            avatarUrl: item.doctor.avatarUrl,
            workplace: item.doctor.workplace || '未知医院',
            status:
              item.relationStatus === 'pending'
                ? '申请中'
                : item.relationStatus === 'approved'
                  ? '已通过'
                  : item.relationStatus === 'removeBinding'
                  ? '已解除绑定'
                  : '已拒绝',
            position: item.doctor.position || '未知职位',
            experience: item.doctor.experience ,
            rating: item.doctor.rating,
          };

          // 请求医生头像的 Base64 数据
          if (doctor.avatarUrl) {
            try {
              const base64Avatar = await getDoctorAvatar(doctor.avatarUrl);
              doctor.avatarUrl = base64Avatar || doctor.avatarUrl; // 请求失败时保留原始 URL
            } catch (err) {
              console.error(`获取医生 ${doctor.doctorId} 的头像失败`);
            }
          }

          return doctor;
        })
      );
    },
    navigateToDoctorInfo(doctor) {
      uni.navigateTo({
        url: `/pages/doctorProfile/doctorProfile?doctor=${encodeURIComponent(JSON.stringify(doctor))}`
      });
    },
    getStatusClass(status) {
      switch (status) {
        case '申请中':
          return 'status-pending';
        case '已通过':
          return 'status-approved';
        case '已解除绑定':
          return 'status-unbind';
        case '已拒绝':
          return 'status-rejected';
        default:
          return '';
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

.status-unbind {
  background-color: #007aff;
  color: #ffffff;
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