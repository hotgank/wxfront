<template>
  <view class="container">
    <view class="header">
      <text class="title">检测报告详情</text>
    </view>
    <scroll-view class="report-content" scroll-y="true">
      <view class="report-section">
        <text class="section-title">报告类型</text>
        <text class="section-content">{{ report.type }}</text>
      </view>
      <view class="report-section">
        <text class="section-title">测评时间</text>
        <text class="section-content">{{ report.date }}</text>
      </view>
      <view class="report-section">
        <text class="section-title">评测结果</text>
        <text class="section-content">{{ report.result }}</text>
      </view>
      <view class="report-section">
        <text class="section-title">治疗方案分析</text>
        <text class="section-content">{{ report.analyse }}</text>
      </view>
      <view class="report-section">
        <text class="section-title">医生留言</text>
        <text class="section-content">{{ report.doctorComment }}</text>
      </view>
      <view class="report-section">
        <text class="section-title">测评图片</text>
        <view class="image-gallery">
          <image v-for="(image, index) in report.images" :key="index" :src="image" mode="aspectFit" class="report-image"
            @tap="previewImage(index)"></image>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      reportId: null,
      report: {
        type: '',
        date: '',
        result: '',
        analyse: '',
        doctorComment: '',
        images: [] // 确保 images 是一个数组
      }
    }
  },
  async onLoad(options) {
    if (options.report) {
      try {
        const report = JSON.parse(decodeURIComponent(options.report));
        this.report = {
          type: report.reportType || '',
          date: report.date || '',
          result: report.result || '请上传正确姿势和角度照片',
          analyse: report.analyse || '',
          doctorComment: report.comment || '暂无医生留言',
          images: report.url ? [report.url] : [], // 确保为数组
        };
      } catch (error) {
        console.error('解析传递参数失败:', error);
      }
    } else {
      console.warn('未接收到任何参数');
    }

    // 调用下载方法并更新图片路径
    try {
      const downloadedImages = await this.downloadImage(this.report.images);
      if (Array.isArray(downloadedImages)) {
        this.report.images = downloadedImages;
      } else {
        console.warn('下载的图片路径不是数组:', downloadedImages);
      }
    } catch (error) {
      console.error('图片下载过程中出错:', error);
    }
  },

  methods: {
    async downloadImage(urls) {
      const token = uni.getStorageSync('token');
      const downloadedImages = [];

      for (const url of urls) {
        try {
          const res = await new Promise((resolve, reject) => {
            uni.downloadFile({
              url: url,
              header: {
                'Authorization': `Bearer ${token}`,
              },
              success: resolve,
              fail: reject
            });
          });

          if (res.statusCode === 200) {
            downloadedImages.push(res.tempFilePath);

          } else {
            console.warn('图片下载失败:', res.statusCode);
          }
        } catch (err) {
          console.error('图片下载失败:', err);
        }
      }

      return downloadedImages; // 返回下载的图片数组
    },

    previewImage(index) {
      if (this.report.images && this.report.images.length > 0) {
        uni.previewImage({
          current: index,
          urls: this.report.images
        });
      } else {
        console.warn('图片列表为空，无法预览');
      }
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
  padding: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.report-content {
  flex: 1;
  padding: 20px;
}

.report-section {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.section-content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.report-image {
  width: 48%;
  height: 150px;
  margin-bottom: 10px;
  border-radius: 5px;
}
</style>