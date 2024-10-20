<template>
  <view class="container">
    <view class="header">
      <text class="title">上传检测照片</text>
    </view>
    <view class="content">
      <text class="instruction">请按照以下要求上传照片：</text>
      <view v-for="(requirement, index) in photoRequirements" :key="index" class="photo-requirement">
        <text class="requirement-title">{{ requirement.title }}</text>
        <view class="photo-upload" @tap="chooseImage(index)">
          <image v-if="uploadedPhotos[index]" :src="uploadedPhotos[index]" mode="aspectFit" class="uploaded-photo"></image>
          <text v-else class="upload-text">点击上传</text>
        </view>
      </view>
      <button class="submit-button" @tap="submitPhotos" :disabled="!allPhotosUploaded">提交检测</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detectionType: '',
      profileId: '',
      photoRequirements: [
        { title: '正面全身照' },
        { title: '侧面全身照' },
        { title: '背面全身照' }
      ],
      uploadedPhotos: []
    }
  },
  computed: {
    allPhotosUploaded() {
      return this.uploadedPhotos.length === this.photoRequirements.length;
    }
  },
  onLoad(option) {
    this.detectionType = option.type;
    this.profileId = option.profileId;
  },
  methods: {
    chooseImage(index) {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.$set(this.uploadedPhotos, index, res.tempFilePaths[0]);
        }
      });
    },
    submitPhotos() {
      if (this.allPhotosUploaded) {
        uni.showLoading({
          title: '正在上传...'
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          });
          // 上传成功后，返回到首页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/index/index'
            });
          }, 2000);
        }, 2000);
      }
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.content {
  flex: 1;
  padding: 20px;
}

.instruction {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.photo-requirement {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.requirement-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.photo-upload {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
}

.upload-text {
  font-size: 16px;
  color: #999;
}

.uploaded-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.submit-button {
  background-color: #007aff;
  color: #ffffff;
  padding: 15px;
  border-radius: 5px;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}

.submit-button:disabled {
  background-color: #cccccc;
}
</style>