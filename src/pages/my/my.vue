<template>
  <view class="container">
    <image class="background-image" src="/static/my/background.jpg" mode="aspectFill"></image>
    <view class="content">
      <!-- 用户信息部分 -->
      <view class="user-info">
        <button class="avatar-button" @tap="onChooseAvatar">
          <image class="avatar" :src="userInfo.avatarUrl" mode="aspectFill"></image>
        </button>
        <view>
          <input
            class="nickname-input"
            v-model="userInfo.username"
            @blur="saveNickname"
            placeholder="请输入新的昵称"
          />
        </view>
      </view>

      <!-- 功能板块 -->
      <view class="function-blocks">
        <!-- 孩子档案 -->
        <view class="block" @click="navigateTo('childProfile')">
          <image class="block-icon" src="/static/my/child-profile.png" mode="aspectFit"></image>
          <text class="block-title">孩子档案</text>
        </view>

        <!-- 我的医生 -->
        <view class="block" @click="navigateTo('myDoctors')">
          <image class="block-icon" src="/static/my/my-doctors.png" mode="aspectFit"></image>
          <text class="block-title">我的医生</text>
        </view>

        <!-- 申请医生记录 -->
        <view class="block" @click="navigateTo('doctorApplications')">
          <image class="block-icon" src="/static/my/doctor-applications.png" mode="aspectFit"></image>
          <text class="block-title">申请医生记录</text>
        </view>

        <!-- 测评记录 -->
        <view class="block" @click="navigateTo('evaluationRecords')">
          <image class="block-icon" src="/static/my/evaluation-records.png" mode="aspectFit"></image>
          <text class="block-title">测评记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserInfo, uploadUsername } from "@/api/user"; // 引用封装的请求方法
import { uploadUserAvatar, getDoctorAvatar } from "@/api/image"; // 引用封装的图片方法

export default {
  data() {
    return {
      userInfo: {
        avatarUrl: "/static/my/default-avatar.jpg", // 默认头像
        username: "微信用户", // 默认昵称
      },
    };
  },
  async onLoad() {
    try {
      // 获取用户信息并更新页面
      const userInfo = await getUserInfo();
      if (userInfo.avatarUrl) {
        try {
          this.userInfo.avatarUrl = userInfo.avatarUrl
        } catch (error) {
          console.error("获取头像失败:", error);
        }
      }
      this.userInfo.username = userInfo.username; // 更新昵称
    } catch (error) {
      console.error("获取用户信息失败:", error);
      uni.showToast({
        title: "获取用户信息失败",
        icon: "none",
      });
    }
  },
  methods: {
    async onChooseAvatar() {
      try {
        const chooseImageResult = await uni.chooseImage({
          count: 1, // 限制只能选择一张图片
          sizeType: ["compressed"], // 压缩图
          sourceType: ["album", "camera"], // 从相册或拍摄获取
        });

        if (chooseImageResult.tempFilePaths && chooseImageResult.tempFilePaths[0]) {
          const avatarPath = chooseImageResult.tempFilePaths[0];

          // 上传头像并获取成功提示
          const successMessage = await uploadUserAvatar(avatarPath);
          uni.showToast({
            title: "成功上传头像",
            icon: "success",
          });

          // 更新用户信息
          const userInfo = await getUserInfo();
          this.userInfo = userInfo;
          this.userInfo.avatarUrl = avatarPath;
        } else {
          throw new Error("未选择图片");
        }
      } catch (error) {
        console.log("上传头像失败:", error);
      }
    },

    async saveNickname() {
      if (!this.userInfo.username.trim()) {
        uni.showToast({
          title: "昵称不能为空",
          icon: "none",
        });
        return;
      }

      try {
        // 调用封装的接口，传入 JSON 数据
        const response = await uploadUsername(
           this.userInfo.username.trim(),
        );

        uni.showToast({
          title: "成功更新昵称",
          icon: "success",
        });
      } catch (error) {
        console.error("更新昵称失败:", error);
        uni.showToast({
          title: "更新昵称失败，请稍后重试",
          icon: "none",
        });
      }
    },

    navigateTo(page) {
      uni.navigateTo({
        url: `/pages/my/${page}/${page}`,
      });
    },
  },
};
</script>

<style>
.container {
  position: relative;
  height: 100vh;
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
  justify-content: space-between;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nickname-input {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  border: none;
  background: transparent;
  border-bottom: 1px solid #ccc;
  text-align: center;
  outline: none;
}

.function-blocks {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
}

.block {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.block:active {
  transform: scale(0.98);
}

.block-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.block-title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.avatar-button {
  border: none;
  background: transparent;
  padding: 0;
}
</style>
