<template>
  <view class="container">
    <view class="header">
      <text class="title">上传检测照片</text>
    </view>
    <view class="content">
      <text class="instruction">请按照以下要求上传照片：</text>
      <br>
      <text class="instruction">
        1. 图片大小不能超过1.5M
      </text>
      <br>
      <text class="instruction">
        2. 背景图尽量干净，建议纯白色背景,否则可能失败
      </text>
      
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
          <image v-if="uploadedPhotos[index]" :src="uploadedPhotos[index]" mode="aspectFit" class="uploaded-photo"></image>
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
import { uploadImage } from '@/api/image'; // 确保调整导入路径
import { aiDetect } from '../../api/aiApi';

export default {
  data() {
    return {
      childId: null,
      detectionType: '',
      profileId: '',
      photoRequirements: [
        { title: '正面全身照' }
        // 可以根据需求添加更多要求
      ],
      uploadedPhotos: [],
      fileSizeLimit: 1.5 * 1024 * 1024 // 1.5 MB in bytes
    };
  },
  computed: {
    allPhotosUploaded() {
      return this.uploadedPhotos.length === this.photoRequirements.length &&
             this.uploadedPhotos.every(photo => photo);
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
          const tempFilePath = res.tempFilePaths[0];
          
          // 使用 uni.getFileInfo 获取文件大小
          uni.getFileInfo({
            filePath: tempFilePath,
            success: (fileInfo) => {
              if (fileInfo.size > this.fileSizeLimit) {
                uni.showToast({
                  title: '图片大小超过1.5M，请重新上传',
                  icon: 'none',
                  duration: 2000
                });
              } else {
                this.$set(this.uploadedPhotos, index, tempFilePath);
              }
            },
            fail: () => {
              uni.showToast({
                title: '获取图片信息失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        },
        fail: () => {
          uni.showToast({
            title: '选择图片失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    async submitPhotos() {
      if (this.allPhotosUploaded) {
        uni.showLoading({
          title: '正在上传...'
        });

        try {
          // 上传每张图片并收集其URL
          const uploadPromises = this.uploadedPhotos.map(photo => uploadImage(photo));
          const uploadedUrls = await Promise.all(uploadPromises);

          uni.hideLoading();

          // 调用AI检测API，假设需要等待结果
          const imageUrl = uploadedUrls[0]; // 假设使用第一张上传的图片
          const aiResult = await aiDetect(this.childId, imageUrl, this.detectionType); // 添加await

          console.log('AI检测结果:', aiResult);

          // 处理AI检测结果
          uni.showToast({
            title: 'AI检测成功',
            icon: 'success',
            duration: 2000
          });

          // 可选：成功后重定向
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
  margin-bottom: 10px;
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
