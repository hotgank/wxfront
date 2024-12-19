<template>
  <view class="container">
    <view class="header">
      <view class="header-content">
        <text class="title">测评记录</text>
        <view class="filter-container">
          <picker 
            mode="selector" 
            :range="reportTypeList" 
            @change="onReportTypeChange" 
            class="report-type-picker"
          >
            <view class="picker-wrapper">
              <text class="picker-text">{{ selectedReportType || '全部类型' }}</text>
              <text class="picker-icon">▼</text>
            </view>
          </picker>
        </view>
      </view>
    </view>
    <scroll-view class="record-list" scroll-y="true">
      <view v-for="(record) in sortedRecords" :key="record.id" class="record-card"
        @click="viewReportDetails(record.id)">
        <view class="record-info">
          <text class="record-name">{{ record.childName }}</text>
          <text class="record-type">{{ record.reportType }}</text>
        </view>
        <button v-if="record.allowState !== 'allow'" class="action-button auth-button"
            @tap.stop="authorizeReport(record.id)">
            授权
          </button>
          <view v-else class="allow-status">
            <text class="status-text">已授权</text>
          </view>
        <view class="record-time">
          <text class="time-text">{{ record.date }}</text>
        </view>
        <view class="record-status" :class="{ 'generating': record.isGenerating }">
          <text>{{ record.isGenerating ? '生成中' : '已完成' }}</text>
        </view>
      </view>
      <view v-if="sortedRecords.length === 0" class="no-profiles">
      <text class="no-profiles-text">暂无测评记录</text>
    </view>
    </scroll-view>
  </view>
</template>

<script>
import dayjs from 'dayjs';
import { selectAllReports, allowReport } from '@/api/report';

export default {
  data() {
    return {
      records: [],
      selectedReportType: '', // 存储选择的报告类型
      timer: null,
      unreadCounts: {}
    }
  },
  computed: {
    // 获取唯一的报告类型，并在开头添加“全部类型”
    reportTypeList() {
      const types = new Set(this.records.map(record => record.reportType));
      return ['全部类型', ...Array.from(types)];
    },
    // 根据选择的报告类型进行排序和过滤
    sortedRecords() {
      let filtered = this.records;
      if (this.selectedReportType && this.selectedReportType !== '全部类型') {
        filtered = filtered.filter(record => record.reportType === this.selectedReportType);
      }
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  onLoad() {
    this.fetchRecords();
    console.log('sortedRecords', this.sortedRecords);
  },
  methods: {
    async authorizeReport(reportId) {
      try {
        await allowReport(reportId);
        const reportIndex = this.records.findIndex(r => r.id === reportId);
        if (reportIndex !== -1) {
          this.$set(this.records[reportIndex], 'allowState', 'allow');
        }
        uni.showToast({
          title: '授权成功',
          icon: 'success'
        });
      } catch (error) {
        console.error('授权失败:', error);
        uni.showToast({
          title: '授权失败',
          icon: 'none'
        });
      }
    },
    async fetchRecords() {
      try {
        const res = await selectAllReports(); // 调用后端接口获取数据

        if (!Array.isArray(res)) {
          throw new Error('后端返回数据格式不正确');
        }

        this.records = res.map(record => {
          const dateArray = record.createdAt;
          let date = null;

          if (Array.isArray(dateArray) && dateArray.length === 6) {
            date = new Date(
              dateArray[0], // 年
              dateArray[1] - 1, // 月
              dateArray[2], // 日
              dateArray[3], // 时
              dateArray[4], // 分
              dateArray[5]  // 秒
            );
          }

          if (isNaN(date)) {
            console.error('Invalid date:', dateArray);
            date = new Date(); // 设置为当前时间或其他默认值
          }

          return {
            id: record.id,
            childName: record.childName,
            reportType: record.reportType,
            date: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
            isGenerating: record.state === '检测中',
            state: record.state,
            result: record.result,
            analyse: record.analyse,
            url: record.url,
            comment: record.comment,
            doctorId: record.doctorId,
            allowState: record.allowState,
          };
        });
      } catch (error) {
        console.error('加载记录失败:', error);
        uni.showToast({
          title: '加载记录失败，请检查网络',
          icon: 'none',
        });
        this.records = []; // 异常情况下重置数据
      }
    },
    viewReportDetails(reportId) {
      const report = this.records.find(r => r.id === reportId);
      if (!report) {
        console.error('报告未找到:', reportId);
        return;
      }

      if (report.isGenerating) {
        uni.showToast({
          title: '报告正在生成中，请稍后查看',
          icon: 'none',
        });
      } else {
        // 构造参数字符串并跳转
        const params = encodeURIComponent(JSON.stringify(report));
        uni.navigateTo({
          url: `/pages/reportDetails/reportDetails?report=${params}`,
        });
      }
    },
    onReportTypeChange(e) {
      const index = e.detail.value;
      this.selectedReportType = this.reportTypeList[index];
      console.log('选择的报告类型:', this.selectedReportType);
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.fetchRecords();
      }, 5000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    showNewMessageNotification(count) {
      console.log(`显示新消息提醒: ${count} 条未读消息`);
      uni.showToast({
        title: `您有 ${count} 条新消息`,
        icon: 'none',
        duration: 2000
      });
    }
  },
  
  async onShow() {
    console.log('页面显示，onShow 被触发');
    await this.fetchRecords();
    if (this.timer === null) {
      console.log("定时器为空，开始计时");
      this.startTimer();
    }
  },
  onHide() {
    console.log('页面卸载，onHide 被触发');
    // this.stopTimer();
  },
  onUnload() {
    console.log('页面卸载，onUnload 被触发');
    // this.stopTimer();
  }
}
</script>

<style>
.auth-button {
  background-color: #52c41a;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 20px;
  color: #ffffff;
}
.allow-status {
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 10px;
  background-color: #333;
}
.action-button {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  margin-left: 5px;
}
.status-text {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.filter-container {
  position: relative;
}

.report-type-picker {
  width: 150px; /* 调整筛选器的宽度 */
}

.picker-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.picker-wrapper:active {
  background-color: #f8f8f8;
  transform: translateY(1px);
}

.picker-text {
  font-size: 14px;
  color: #333;
}

.picker-icon {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s ease;
}

.record-list {
  flex: 1;
  padding: 10px;
}

.record-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9); /* Slightly more opaque to stand out against background */
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
.no-profiles {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .no-profiles-text {
    font-size: 18px;
    color: #999;
  }

/* 额外样式，确保响应式设计 */
@media (max-width: 768px) {
  .picker-wrapper {
    padding: 6px 10px;
  }

  .title {
    font-size: 20px;
  }

  .record-name {
    font-size: 16px;
  }

  .record-type, .record-time, .record-status {
    font-size: 12px;
  }

  .action-button, .auth-button {
    padding: 4px 8px;
    font-size: 10px;
  }
  
}
</style>
