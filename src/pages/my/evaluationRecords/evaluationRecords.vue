<template>
  <view class="container">
    <view class="header">
      <text class="title">测评记录</text>
    </view>
    <scroll-view class="record-list" scroll-y="true">
      <view v-for="(record) in sortedRecords" :key="record.id" class="record-card"
        @click="viewReportDetails(record.id)">
        <view class="record-info">
          <text class="record-name">{{ record.childName }}</text>
          <text class="record-type">{{ record.reportType }}</text>
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
import dayjs from 'dayjs';
import { selectAllReports } from '@/api/report'
export default {
  data() {
    return {
      records: [

      ]
    }
  },
  computed: {
    sortedRecords() {
      return this.records.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  onLoad() {
    this.fetchRecords();
    console.log('sortedRecords', this.sortedRecords);
  },
  methods: {

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