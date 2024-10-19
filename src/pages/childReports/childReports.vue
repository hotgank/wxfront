<template>
    <view class="container">
      <view class="header">
        <text class="title">{{ childName }}的检测报告</text>
      </view>
      <scroll-view class="report-list" scroll-y="true">
        <view v-for="(report, index) in sortedReports" :key="index" class="report-card" :class="{ 'generating': report.isGenerating }" @tap="viewReportDetails(report)">
          <view class="report-info">
            <text class="report-date">{{ report.date }}</text>
            <text class="report-type">{{ report.type }}</text>
          </view>
          <view v-if="report.isGenerating" class="generating-badge">
            <text class="generating-text">生成中</text>
          </view>
          <view v-else class="report-status">
            <text class="status-text">已完成</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {
        childId: null,
        childName: '',
        reports: []
      }
    },
    computed: {
      sortedReports() {
        return this.reports.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    },
    onLoad(option) {
      this.childId = option.id;
      this.loadChildInfo();
      this.loadReports();
    },
    methods: {
      loadChildInfo() {
        // 这里应该从后端或本地存储获取孩子信息
        // 这里使用模拟数据
        this.childName = '小明';
      },
      loadReports() {
        // 这里应该从后端获取检测报告
        // 这里使用模拟数据
        this.reports = [
          { id: 1, date: '2023-05-01', type: 'AI全面体态检测', isGenerating: false },
          { id: 2, date: '2023-04-15', type: '脊柱健康检测', isGenerating: false },
          { id: 3, date: '2023-03-20', type: 'Cobb角测量', isGenerating: false },
          { id: 4, date: '2023-05-10', type: 'AI全面体态检测', isGenerating: true }
        ];
      },
      viewReportDetails(report) {
        if (!report.isGenerating) {
          uni.navigateTo({
            url: `/pages/reportDetails/reportDetails?id=${report.id}`
          });
        } else {
          uni.showToast({
            title: '报告正在生成中，请稍后查看',
            icon: 'none'
          });
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
  
  .report-list {
    flex: 1;
    padding: 10px;
  }
  
  .report-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .report-card.generating {
    background-color: #fff0f0;
    border: 1px solid #ffcccb;
  }
  
  .report-info {
    display: flex;
    flex-direction: column;
  }
  
  .report-date {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
  
  .report-type {
    font-size: 14px;
    color: #666;
  }
  
  .generating-badge {
    background-color: #ff3b30;
    padding: 5px 10px;
    border-radius: 15px;
  }
  
  .generating-text {
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
  }
  
  .report-status {
    background-color: #4cd964;
    padding: 5px 10px;
    border-radius: 15px;
  }
  
  .status-text {
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
  }
  </style>