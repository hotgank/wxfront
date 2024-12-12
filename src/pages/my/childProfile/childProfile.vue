<template>
  <view class="container">
    <view class="header">
      <text class="title">孩子档案</text>
      <button class="add-button" @tap="showAddModal">添加档案</button>
    </view>
    <scroll-view class="profile-list" scroll-y="true">
      <view
        v-for="(profile, index) in childrenProfiles"
        :key="profile.childId"
        class="profile-card"
        @tap="navigateToReports(profile.childId)"
      >
        <view class="profile-info">
          <text class="profile-name">{{ profile.name }}</text>
          <text class="profile-details">
            {{ profile.age }}岁 | {{ profile.gender }} | {{ profile.weight }}kg | {{ profile.height }}cm
          </text>
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

        <picker
          mode="date"
          :start="birthdateStart"
          :end="birthdateEnd"
          @change="updateBirthdate"
          class="modal-input"
        >
          <view class="picker">
            出生日期：{{ currentProfile.birthdate ? currentProfile.birthdate : '请选择' }}
          </view>
        </picker>

        <picker :range="genderOptions" @change="updateGender" class="modal-input">
          <view class="picker">
            性别：{{ currentProfile.gender ? currentProfile.gender : '请选择' }}
          </view>
        </picker>

        <input v-model.number="currentProfile.weight" class="modal-input" type="number" placeholder="体重(kg)" />
        <input v-model.number="currentProfile.height" class="modal-input" type="number" placeholder="身高(cm)" />

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
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0]; // 当前日期
    const minDateObj = new Date();
    minDateObj.setFullYear(minDateObj.getFullYear() - 18); // 最小年龄18岁
    const minDate = minDateObj.toISOString().split('T')[0];

    return {
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      currentProfile: { name: '', gender: '', birthdate: '', weight: '', height: '', age: '' },
      editIndex: -1,
      genderOptions: ['男', '女'],
      deleteChildId: null,
      birthdateStart: minDate,
      birthdateEnd: maxDate,
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
      if (!this.validateProfile()) {
        return;
      }

      this.currentProfile.age = this.calculateAge(this.currentProfile.birthdate);
      if (this.isEditing) {
        await this.updateChildProfile(this.currentProfile);
        uni.showToast({
          title: '档案已更新',
          icon: 'success'
        });
      } else {
        await this.addChildProfile(this.currentProfile);
        uni.showToast({
          title: '档案已添加',
          icon: 'success'
        });
      }
      this.hideModal();
      // 为确保数据一致性，重新加载档案
      await this.loadChildrenProfiles();
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
    validateProfile() {
      const { name, gender, birthdate, weight, height } = this.currentProfile;
      if (!name || !gender || !birthdate || !weight || !height) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return false;
      }

      const selectedDate = new Date(birthdate);
      const today = new Date();
      if (selectedDate > today) {
        uni.showToast({
          title: '出生日期不能超过今天',
          icon: 'none'
        });
        return false;
      }

      const age = this.calculateAge(birthdate);
      if (age < 0 || age > 18) {
        uni.showToast({
          title: '孩子年龄必须在0到18岁之间',
          icon: 'none'
        });
        return false;
      }

      if (weight <= 0 || height <= 0) {
        uni.showToast({
          title: '体重和身高必须为正数',
          icon: 'none'
        });
        return false;
      }

      return true;
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
        uni.showToast({
          title: '档案已删除',
          icon: 'success'
        });
        this.hideDeleteModal();
        // 刷新数据
        await this.loadChildrenProfiles();
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

<style scoped>
/* 保持之前的样式不变 */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #dcdcdc;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #333333;
}

.add-button {
  background-color: #007aff;
  color: #ffffff;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #005bb5;
}

.profile-list {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
}

.profile-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.profile-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.profile-details {
  font-size: 14px;
  color: #666666;
  margin-top: 4px;
}

.profile-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.edit {
  background-color: #4cd964;
}

.action-button.edit:hover {
  background-color: #43c055;
}

.action-button.delete {
  background-color: #ff3b30;
}

.action-button.delete:hover {
  background-color: #e02d24;
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
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
  text-align: center;
}

.modal-input,
.picker {
  width: 100%;
  height: 40px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 0 12px;
  margin-bottom: 10px;
  font-size: 14px;
  box-sizing: border-box;
}

.picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-button {
  flex: 1;
  padding: 10px 0;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.modal-button.cancel {
  background-color: #f0f0f0;
  color: #333333;
  border: 1px solid #dcdcdc;
}

.modal-button.cancel:hover {
  background-color: #e0e0e0;
}

.modal-button.confirm {
  background-color: #007aff;
  color: #ffffff;
}

.modal-button.confirm:hover {
  background-color: #005bb5;
}

.modal-button.delete {
  background-color: #ff3b30;
  color: #ffffff;
}

.modal-button.delete:hover {
  background-color: #e02d24;
}

.modal-text {
  font-size: 16px;
  color: #666666;
  margin-bottom: 20px;
  text-align: center;
  line-height: 1.5;
}

@keyframes scaleIn {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .modal-content {
    padding: 16px 20px;
  }

  .header {
    padding: 14px 16px;
  }

  .add-button {
    padding: 6px 12px;
    font-size: 13px;
  }

  .profile-card {
    padding: 12px 14px;
  }

  .profile-name {
    font-size: 16px;
  }

  .profile-details {
    font-size: 13px;
  }

  .action-button {
    padding: 5px 10px;
    font-size: 11px;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-input,
  .picker {
    height: 38px;
    font-size: 13px;
  }

  .modal-button {
    font-size: 15px;
    padding: 8px 0;
  }

  .modal-text {
    font-size: 15px;
  }
}
</style>
