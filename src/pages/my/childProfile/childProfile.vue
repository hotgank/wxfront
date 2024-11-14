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
          <text class="profile-details">{{ profile.age }}岁 | {{ profile.gender }} | {{ profile.weight }}kg | {{
            profile.height }}cm</text>
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
        <picker mode="date" @change="updateBirthdate" class="modal-input">
          <view class="picker">
            出生日期：{{ currentProfile.birthdate ? currentProfile.birthdate : '请选择' }}
          </view>
        </picker>
        <picker :range="genderOptions" @change="updateGender" class="modal-input">
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
import { getAllChildrenProfiles, getChildDetails, addChildProfile,updateChildProfile,deleteChildProfile } from '@/api/child.js';
// import  '@/api/testApi';
export default {
  data() {
    return {
      profiles: [],
      showModal: false,
      isEditing: false,
      currentProfile: { name: '', school: '', gender: '', birthdate: '', weight: '', height: '', age: '' },
      editIndex: -1,
      genderOptions: ['男', '女']
    };
  },
  async mounted() {
    await this.loadChildrenProfiles();
  },
  methods: {
    async loadChildrenProfiles() {
      try {
        const basicProfiles = await getAllChildrenProfiles();
        const detailedProfiles = await Promise.all(
          basicProfiles.map(async (profile) => {
            const details = await getChildDetails(profile.childId);
            const age = this.calculateAge(details.birthdate);
            const childId = profile.childId;
            return { ...details, relationId: profile.relationId, age, childId: childId };
          })
        );
        this.profiles = detailedProfiles.sort((a, b) => a.relationId - b.relationId);
        console.log('Children profiles:', detailedProfiles);
      } catch (error) {
        console.error('加载孩子档案失败:', error.message);
        uni.showToast({
          title: '加载孩子档案失败',
          icon: 'none'
        });
      }
    },
    updateBirthdate(event) {
      this.currentProfile.birthdate = event.detail.value;
    },
    updateGender(event) {
      this.currentProfile.gender = this.genderOptions[event.detail.value];
    },
    showAddModal() {
      this.isEditing = false;
      this.currentProfile = { name: '', school: '', gender: '', birthdate: '', weight: '', height: '', childId: '' };
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
    async confirmProfile() {
      const { name, gender, birthdate, weight, height, } = this.currentProfile;
      
      this.currentProfile.age = this.calculateAge(birthdate);
      const age= this.currentProfile.age;
      if (name && gender && birthdate && weight && height) {
        if (this.isEditing) {
          // 编辑模式：更新档案
          try {
            // 确保 childId 已包含在 currentProfile 中
            delete this.currentProfile.age;
            console.log("更新请求数据:", this.currentProfile);
            await updateChildProfile(this.currentProfile); // 调用 API 更新档案
            this.profiles[this.editIndex] = { ...this.currentProfile,age };

            uni.showToast({
              title: '档案更新成功',
              icon: 'success'
            });
          } catch (error) {
            uni.showToast({
              title: '更新档案失败',
              icon: 'none'
            });
          }
        } else {
          try {
            const relationId = await addChildProfile(this.currentProfile); // 调用 API 创建档案
            this.profiles.push({ ...this.currentProfile, relationId });
            uni.showToast({
              title: '档案添加成功',
              icon: 'success'
            });
          } catch (error) {
            uni.showToast({
              title: '添加档案失败',
              icon: 'none'
            });
          }
        }
        this.hideModal();
      } else {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
      }
    },
    calculateAge(birthdate) {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    deleteProfile(index) {
      const childId = this.profiles[index].childId; // 获取要删除的档案的 childId
      uni.showModal({
        title: '确认删除',
        content: '是否确定删除该档案？',
        success: async (res) => {
          if (res.confirm) {
            try {
              // 调用删除孩子档案的请求
              await deleteChildProfile(childId);
              
              // 从列表中移除删除的档案
              this.profiles.splice(index, 1);

              uni.showToast({
                title: '档案删除成功',
                icon: 'success'
              });
            } catch (error) {
              uni.showToast({
                title: '删除档案失败',
                icon: 'none'
              });
              console.error('删除孩子档案失败:', error.message);
            }
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

.modal-input,
.picker {
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