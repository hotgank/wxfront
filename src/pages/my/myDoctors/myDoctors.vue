<template>
    <view class="container">
      <image class="background-image" src="/static/background-doctors.jpg" mode="aspectFill"></image>
      <view class="content">
        <view class="header">
          <text class="title">我的医生</text>
        </view>
        <view class="doctor-list">
          <view v-for="(doctor, index) in doctors" :key="index" class="doctor-card" @click="navigateToChat(doctor.id)">
            <image :src="doctor.avatar" mode="aspectFill" class="doctor-avatar"></image>
            <view class="doctor-info">
              <text class="doctor-name">{{ doctor.name }}</text>
              <text class="doctor-hospital">{{ doctor.hospital }}</text>
              <text class="doctor-specialty">擅长：{{ doctor.specialty }}</text>
            </view>
          </view>
        </view>
      </view>
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
            specialty: '脊柱侧弯、颈椎病'
          },
          {
            id: 2,
            name: '李医生',
            avatar: '/static/doctor-avatars/doctor2.jpg',
            hospital: '上海瑞金医院',
            specialty: '青少年体态矫正、运动损伤'
          },
          {
            id: 3,
            name: '王医生',
            avatar: '/static/doctor-avatars/doctor3.jpg',
            hospital: '广州中山大学附属第一医院',
            specialty: 'Cobb角测量、脊柱畸形'
          }
        ]
      }
    },
    methods: {
      navigateToChat(doctorId) {
        uni.navigateTo({
          url: `/pages/doctorChat/doctorChat?id=${doctorId}`
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