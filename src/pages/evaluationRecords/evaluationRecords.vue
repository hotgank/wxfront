<template>
  <view class="container">
    <view class="header">
      <text class="title">测评记录</text>
    </view>
    <scroll-view class="record-list" scroll-y="true">
      <view v-for="(record, index) in sortedRecords" :key="index" class="record-card" @tap="viewReportDetails(record.id)">
        <view class="record-info">
          <text class="record-name">{{ record.childName }}</text>
          <text class="record-type">{{ record.type }}</text>
        </view>
        <view class="record-time">
          <text class="time-text">{{ record.date }}</text>
        </view>
        <view class="record-status" :class="{ 'generating': record.isGenerating }">
          <text>{{ record.isGenerating ? '生成中' : '已完成' }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      records: [
        { id: 1, childName: '小明', type: 'AI全面体态检测', date: '2023-05-10 14:30', isGenerating: false },
        { id: 2, childName: '小红', type: '脊柱健康检测', date: '2023-05-09 10:15', isGenerating: false },
        { id: 3, childName: '小华', type: 'Cobb角测量', date: '2023-05-08 16:45', isGenerating: false },
        { id: 4, childName: '小明', type: 'AI全面体态检测', date: '2023-05-07 09:00', isGenerating: false },
        { id: 5, childName: '小红', type: '脊柱健康检测', date: '2023-05-11 11:30', isGenerating: true }
      ]
    }
  },
  computed: {
    sortedRecords() {
      return this.records.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  methods: {
    viewReportDetails(recordId) {
      const record = this.records.find(r => r.id === recordId);
      if (record.isGenerating) {
        uni.showToast({
          title: '报告正在生成中，请稍后查看',
          icon: 'none'
        });
      } else {
        uni.navigateTo({
          url: `/pages/reportDetails/reportDetails?id=${recordId}`
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
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.record-list {
  flex: 1;
  padding: 10px;
}

.record-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.record-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.record-type {
  font-size: 14px;
  color: #666;
}

.record-time {
  font-size: 14px;
  color: #999;
  margin-right: 10px;
}

.record-status {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.record-status:not(.generating) {
  background-color: #4cd964;
  color: #ffffff;
}

.record-status.generating {
  background-color: #ff9500;
  color: #ffffff;
}
</style>