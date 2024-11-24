<template>
  <view class="container">
    <view class="header">
      <text class="title">孩子档案</text>
      <button class="add-button" @tap="showAddModal">添加档案</button>
    </view>
    <scroll-view class="profile-list" scroll-y="true">
      <view v-for="(profile, index) in childrenProfiles" :key="profile.childId" class="profile-card"
        @tap="navigateToReports(profile.childId)">
        <view class="profile-info">
          <text class="profile-name">{{ profile.name }}</text>
          <text class="profile-details">{{ profile.age }}岁 | {{ profile.gender }} | {{ profile.weight }}kg | {{
            profile.height }}cm</text>
        </view>
        <view class="profile-actions">
          <button class="action-button edit" @tap.stop="showEditModal(index)">编辑</button>
          <button class="action-button delete" @tap.stop="showDeleteConfirmation(profile.childId)">删除</button>
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

    <!-- 删除确认模态框 -->
    <view class="modal" v-if="showDeleteModal">
      <view class="modal-content">
        <text class="modal-title">确认删除</text>
        <text class="modal-text">您确定要删除这个孩子的档案吗？<br>此操作不可撤销。</text>
        <view class="modal-buttons">
          <button class="modal-button cancel" @tap="hideDeleteModal">取消</button>
          <button class="modal-button delete" @tap="confirmDelete">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      currentProfile: { name: '', gender: '', birthdate: '', weight: '', height: '', age: '' },
      editIndex: -1,
      genderOptions: ['男', '女'],
      deleteChildId: null
    };
  },
  computed: {
    ...mapState(['childrenProfiles'])
  },
  async mounted() {
    await this.loadChildrenProfiles();
  },
  methods: {
    ...mapActions(['loadChildrenProfiles', 'addChildProfile', 'updateChildProfile', 'deleteChildProfile']),

    updateBirthdate(event) {
      this.currentProfile.birthdate = event.detail.value;
    },
    updateGender(event) {
      this.currentProfile.gender = this.genderOptions[event.detail.value];
    },
    showAddModal() {
      this.isEditing = false;
      this.currentProfile = { name: '', gender: '', birthdate: '', weight: '', height: '' };
      this.showModal = true;
    },
    showEditModal(index) {
      this.isEditing = true;
      this.currentProfile = { ...this.childrenProfiles[index] };
      this.showModal = true;
    },
    hideModal() {
      this.showModal = false;
    },
    async confirmProfile() {
      this.currentProfile.age = this.calculateAge(this.currentProfile.birthdate);
      if (this.currentProfile.name && this.currentProfile.gender && this.currentProfile.birthdate && this.currentProfile.weight && this.currentProfile.height) {
        if (this.isEditing) {
          await this.updateChildProfile(this.currentProfile);
        } else {
          await this.addChildProfile(this.currentProfile);
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
    showDeleteConfirmation(childId) {
      this.deleteChildId = childId;
      this.showDeleteModal = true;
    },
    hideDeleteModal() {
      this.showDeleteModal = false;
      this.deleteChildId = null;
    },
    async confirmDelete() {
      if (this.deleteChildId) {
        await this.deleteChildProfile(this.deleteChildId);
        this.hideDeleteModal();
      }
    },
    navigateToReports(childId) {
      uni.navigateTo({
        url: `/pages/childReports/childReports?childId=${childId}`
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
  width: 90%;
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

.modal-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
.modal-content {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  max-width: 400px; /* 限制最大宽度 */
  text-align: center; /* 居中文本 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
  animation: scaleIn 0.3s ease; /* 弹出时添加动画 */
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
}

.modal-text {
  font-size: 16px;
  color: #666666;
  margin-bottom: 20px;
  line-height: 1.5; /* 增加行间距 */
}

.modal-buttons {
  display: flex;
  justify-content: space-between; /* 按钮左右分布 */
  gap: 10px; /* 按钮之间增加间距 */
}

.modal-button {
  flex: 1; /* 按钮宽度均分 */
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
}

.cancel {
  background-color: #f5f5f5;
  color: #333333;
  border: 1px solid #e0e0e0; /* 添加边框以增强对比 */
}

.delete {
  background-color: #ff3b30;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(255, 59, 48, 0.5); /* 删除按钮增加阴影 */
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>