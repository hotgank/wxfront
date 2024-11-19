<template>
    <view class="container">
      <image class="background-image" src="/static/icons/background-message.jpg" mode="aspectFill"></image>
      <view class="content">
        <view class="header">
          <text class="title">我的医生</text>
        </view>
        <view class="doctor-list">
          <view v-for="doctor in doctors" :key="doctor.doctorId" class="doctor-card" @tap="navigateToChat(doctor.id)">
            <image :src="doctor.avatar" mode="aspectFill" class="doctor-avatar"
            @tap="navigateToDoctor(doctor)"></image>
            <view class="doctor-info">
              <text class="doctor-name">{{ doctor.name }}</text>
              <text class="doctor-hospital">{{ doctor.workplace }}</text>
              <text class="doctor-specialty">{{ doctor.experience }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  import { getMyDoctors } from '@/api/doctor'
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
          if (!this.doctors.length) { // 如果医生列表为空则加载数据
            const doctors = await getMyDoctors();
            this.doctors = doctors;
          }
        } catch (error) {
          uni.showToast({
            title: '加载医生信息失败',
            icon: 'none'
          });
        }
      },
      navigateToChat(doctorId) {
        uni.navigateTo({
          url: `/pages/doctorChat/doctorChat?id=${doctorId}`
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
  </style>