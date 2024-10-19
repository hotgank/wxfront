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
          <text class="section-content">{{ report.treatmentPlan }}</text>
        </view>
        <view class="report-section">
          <text class="section-title">医生留言</text>
          <text class="section-content">{{ report.doctorComment }}</text>
        </view>
        <view class="report-section">
          <text class="section-title">测评图片</text>
          <view class="image-gallery">
            <image 
              v-for="(image, index) in report.images" 
              :key="index" 
              :src="image" 
              mode="aspectFit" 
              class="report-image"
              @tap="previewImage(index)"
            ></image>
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
          treatmentPlan: '',
          doctorComment: '',
          images: []
        }
      }
    },
    onLoad(option) {
      this.reportId = option.id;
      this.loadReportDetails();
    },
    methods: {
      loadReportDetails() {
        // 这里应该从后端获取报告详情
        // 这里使用模拟数据
        this.report = {
          type: 'AI全面体态检测',
          date: '2023-05-01 14:30',
          result: '轻度脊柱侧弯',
          treatmentPlan: '建议进行定期的物理治疗和特定的运动锻炼。每周进行3次，每次30分钟的核心肌群训练和柔韧性练习。同时，建议使用背背佳等辅助器具来帮助改善姿势。',
          doctorComment: '患者的脊柱侧弯程度较轻，及时进行干预和治疗可以有效改善。建议3个月后复查，观察治疗效果。如果症状加重，请及时就医。',
          images: [
            '/static/report-images/image1.jpg',
            '/static/report-images/image2.jpg',
            '/static/report-images/image3.jpg'
          ]
        };
      },
      previewImage(index) {
        uni.previewImage({
          current: index,
          urls: this.report.images
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