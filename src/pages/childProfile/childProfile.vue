<template>
    <view class="container">
      <view class="header">
        <text class="title">孩子档案</text>
        <button class="add-button" @tap="showAddModal">添加档案</button>
      </view>
      <scroll-view class="profile-list" scroll-y="true">
        <view v-for="(profile, index) in profiles" :key="index" class="profile-card" @tap="navigateToReports(profile.id)">
          <view class="profile-info">
            <text class="profile-name">{{ profile.name }}</text>
            <text class="profile-details">{{ profile.age }}岁 | {{ profile.gender }} | {{ profile.weight }}kg | {{ profile.height }}cm</text>
          </view>
          <view class="profile-actions">
            <button class="action-button edit" @tap.stop="showEditModal(index)">编辑</button>
            <button class="action-button delete" @tap.stop="deleteProfile(index)">删除</button>
          </view>
        </view>
      </scroll-view>
  
      <!-- 添加/编辑档案模态框 -->
      <view class="modal" v-if="showModal">
        <view class="modal-content">
          <text class="modal-title">{{ isEditing ? '编辑档案' : '添加档案' }}</text>
          <input v-model="currentProfile.name" class="modal-input" placeholder="姓名" />
          <input v-model="currentProfile.age" class="modal-input" type="number" placeholder="年龄" />
          <picker v-model="currentProfile.gender" class="modal-input" :range="genderOptions">
            <view class="picker">
              性别：{{ currentProfile.gender ? currentProfile.gender : '请选择' }}
            </view>
          </picker>
          <input v-model="currentProfile.weight" class="modal-input" type="digit" placeholder="体重(kg)" />
          <input v-model="currentProfile.height" class="modal-input" type="digit" placeholder="身高(cm)" />
          <view class="modal-buttons">
            <button class="modal-button cancel" @tap="hideModal">取消</button>
            <button class="modal-button confirm" @tap="confirmProfile">确认</button>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {
        profiles: [
          { id: 1, name: '小明', age: 8, gender: '男', weight: 25.5, height: 130 },
          { id: 2, name: '小红', age: 6, gender: '女', weight: 20.0, height: 115 },
          { id: 3, name: '小华', age: 10, gender: '男', weight: 35.0, height: 145 }
        ],
        showModal: false,
        isEditing: false,
        currentProfile: { name: '', age: '', gender: '', weight: '', height: '' },
        editIndex: -1,
        genderOptions: ['男', '女']
      }
    },
    methods: {
      showAddModal() {
        this.isEditing = false;
        this.currentProfile = { name: '', age: '', gender: '', weight: '', height: '' };
        this.showModal = true;
      },
      showEditModal(index) {
        this.isEditing = true;
        this.currentProfile = { ...this.profiles[index] };
        this.editIndex = index;
        this.showModal = true;
      },
      hideModal() {
        this.showModal = false;
      },
      confirmProfile() {
        if (this.currentProfile.name && this.currentProfile.age && this.currentProfile.gender && this.currentProfile.weight && this.currentProfile.height) {
          if (this.isEditing) {
            this.profiles[this.editIndex] = { ...this.currentProfile };
          } else {
            this.profiles.push({ ...this.currentProfile, id: Date.now() });
          }
          this.hideModal();
        } else {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          });
        }
      },
      deleteProfile(index) {
        uni.showModal({
          title: '确认删除',
          content: '是否确定删除该档案？',
          success: (res) => {
            if (res.confirm) {
              this.profiles.splice(index, 1);
            }
          }
        });
      },
      navigateToReports(childId) {
        uni.navigateTo({
          url: `/pages/childReports/childReports?id=${childId}`
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .add-button {
    background-color: #007aff;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .profile-list {
    flex: 1;
    padding: 10px;
  }
  
  .profile-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .profile-info {
    display: flex;
    flex-direction: column;
  }
  
  .profile-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .profile-details {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
  }
  
  .profile-actions {
    display: flex;
  }
  
  .action-button {
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    margin-left: 10px;
  }
  
  .edit {
    background-color: #4cd964;
    color: #ffffff;
  }
  
  .delete {
    background-color: #ff3b30;
    color: #ffffff;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
    width: 80%;
  }
  
  .modal-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }
  
  .modal-input, .picker {
    width: 100%;
    height: 40px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 0 10px;
    margin-bottom: 10px;
    font-size: 14px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
  
  .modal-button {
    padding: 8px 16px;
    border-radius: 5px;
    font-size: 14px;
    margin-left: 10px;
  }
  
  .cancel {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .confirm {
    background-color: #007aff;
    color: #ffffff;
  }
  </style>