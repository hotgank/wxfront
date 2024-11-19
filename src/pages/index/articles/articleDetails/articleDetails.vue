<template>
  <view class="article-detail">
    <view class="article-header">
      <text v-if="article.title" class="article-title">{{ article.title }}</text>
      <view class="article-meta" v-if="article.type || article.publishDate">
        <text v-if="article.type" class="article-type">{{ article.type }}</text>
        <text v-if="article.publishDate" class="article-date">{{ formatDate(article.publishDate) }}</text>
      </view>
      <view class="doctor-info" v-if="doctor.name || doctor.doctorAvatar">
        <image v-if="doctor.doctorAvatar" :src="doctor.doctorAvatar" alt="医生头像" class="doctor-avatar" />
        <text v-if="doctor.name" class="doctor-name">{{ doctor.name }}</text>
      </view>
    </view>
    <view class="article-content" v-if="article.content.length > 0">
      <text v-for="(paragraph, index) in article.content" :key="index" class="content-paragraph">{{ paragraph }}</text>
    </view>
    <view v-else class="loading-placeholder">内容加载中，请稍候...</view>
  </view>
</template>

<script>
import { getDetails, getDoctorDetails } from '@/api/healthArticle'; // 导入请求方法

export default {
  data() {
    return {
      article: {
        id: '',
        title: '',
        type: '',
        publishDate: null,
        content: []
      },
      doctor: {
        name: '',
        doctorAvatar: ''
      },
      loading: false // 添加加载状态
    };
  },
  onLoad(option) {
    const articleId = option.id;
    this.fetchData(articleId);
  },
  methods: {
    preprocessContent(contentString) {
    // 按标点符号进行分段，并过滤空段落
    return contentString
      .split(/(?<=[。！？])/g) // 按句号、问号或感叹号后切分
      .map(paragraph => paragraph.trim()) // 去掉多余空格
      .filter(paragraph => paragraph.length > 0); // 过滤空字符串
  },
  async fetchData(articleId) {
    uni.showLoading({
      title: '加载中...'
    });
    try {
      // 获取文章详情
      const articleResponse = await getDetails(articleId);

      // 设置文章内容，处理 `content`
      this.article = {
        ...articleResponse,
        content: this.preprocessContent(articleResponse.content) // 调用预处理方法
      };

      // 获取医生详情
      const doctorResponse = await getDoctorDetails(articleId);
      this.doctor = {
        name: doctorResponse.name,
        doctorAvatar: doctorResponse.avatar
      };
    } catch (error) {
      console.error('加载数据失败:', error);
      uni.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      uni.hideLoading();
    }
  },
      formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}年${month}月${day}日`;
    }
  }
};
</script>

<style scoped>
.article-detail {
  padding: 30rpx;
  background-color: #ffffff;
}

.article-header {
  margin-bottom: 40rpx;
}

.article-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.article-meta {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.article-type {
  background-color: #e6f3ff;
  color: #0066cc;
  font-size: 24rpx;
  padding: 6rpx 12rpx;
  border-radius: 6rpx;
  margin-right: 20rpx;
}

.article-date {
  color: #666;
  font-size: 24rpx;
}

.doctor-info {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}

.doctor-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  border: 2rpx solid #e6e6e6;
}

.doctor-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.article-content {
  line-height: 1.6;
  color: #333;
}

.content-paragraph {
  display: block;
  margin-bottom: 30rpx;
  font-size: 28rpx;
}

.loading-placeholder {
  text-align: center;
  color: #888;
  font-size: 26rpx;
  margin-top: 40rpx;
}
</style>
