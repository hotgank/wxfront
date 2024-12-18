<template>
  <view class="container">
    <view class="header">
      <text class="title">上传检测照片</text>
    </view>
    <view class="content">
      <text class="instruction">请按照以下要求上传照片：</text>
      
      <!-- 添加示例图片 -->
      <view class="example-image">
        <image 
          src="/static/example.png"
          mode="aspectFit"
          class="example-photo"
        ></image>
        <text class="example-caption">示例图片</text>
      </view>

      <view v-for="(requirement, index) in photoRequirements" :key="index" class="photo-requirement">
        <text class="requirement-title">{{ requirement.title }}</text>
        <view class="photo-upload">
          <image v-if="uploadedPhotos[index]" :src="uploadedPhotos[index]" mode="aspectFit" class="uploaded-photo">
          </image>
          <view v-else class="upload-options">
            <button @tap="chooseImage(index, 'album')" class="upload-option">从相册选择</button>
            <button @tap="chooseImage(index, 'camera')" class="upload-option">拍照上传</button>
          </view>
        </view>
      </view>
      <button class="submit-button" @tap="submitPhotos" :disabled="!allPhotosUploaded">提交检测</button>
    </view>
  </view>
</template>


<script>
import { uploadImage } from '@/api/image'; // Make sure to adjust the import path
import { aiDetect } from '../../api/aiApi';
export default {
  data() {
    return {
      childId: null,
      detectionType: '',
      profileId: '',
      photoRequirements: [
        { title: '正面全身照' }
      ],
      uploadedPhotos: []
    };
  },
  computed: {
    allPhotosUploaded() {
      return this.uploadedPhotos.length === this.photoRequirements.length;
    }
  },
  onLoad(option) {
    this.detectionType = option.type;
    this.childId = option.childId;
  },
  methods: {
    chooseImage(index, sourceType) {
      console.log('选择的图片来源:', sourceType);
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: [sourceType],
        success: (res) => {
          this.$set(this.uploadedPhotos, index, res.tempFilePaths[0]);
        }
      });
    },
    async submitPhotos() {
      if (this.allPhotosUploaded) {
        uni.showLoading({
          title: '正在上传...'
        });

        try {
          // Upload each photo and collect their URLs
          const uploadPromises = this.uploadedPhotos.map(photo => uploadImage(photo));
          const uploadedUrls = await Promise.all(uploadPromises);

          uni.hideLoading();

          // Call the AI detection API with the first uploaded image URL
          const imageUrl = uploadedUrls[0]; // Assuming you want to use the first uploaded photo
          const aiResult = aiDetect(this.childId, imageUrl,this.detectionType);

          console.log('AI检测结果:', aiResult);

          // Handle the AI detection result here
          uni.showToast({
            title: 'AI检测成功',
            icon: 'success',
            duration: 2000
          });

          // Optionally redirect after success
          setTimeout(() => {
            uni.reLaunch({
              url: `/pages/my/my` 
            });
          }, 2000);

        } catch (error) {
          uni.hideLoading();
          console.error('上传或AI检测失败:', error.message);
          uni.showToast({
            title: '上传或AI检测失败',
            icon: 'none'
          });
        }
      }
    }
  }
};

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

.upload-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}


.upload-option {
  background-color: #007aff;
  color: #ffffff;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  margin: 5px 0;
  width: 80%;
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
.example-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
}

.example-photo {
  width: 100%;
  height: 200px;
  object-fit: contain;
}

.example-caption {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}
</style>