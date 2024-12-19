<template>
  <view class="container">
    <view class="header">
      <text class="title">{{ childName }}的检测报告</text>
    </view>
    <scroll-view class="report-list" scroll-y="true">
      <view v-if="reports.length === 0" class="no-reports">
        <text>暂无报告</text>
      </view>
      <view v-for="(report) in sortedReports" :key="report.reportId" class="report-card"
        :class="{ 'generating': report.isGenerating }" @tap="viewReportDetails(report)">
        <view class="report-info">
          <text class="report-date">{{ report.date }}</text>
          <text class="report-type">{{ report.reportType }}</text>
        </view>
        <view class="report-status-and-actions">
          <button v-if="report.allowState !== 'allow'" class="action-button auth-button"
            @tap.stop="authorizeReport(report.reportId)">
            授权
          </button>
          <view v-else class="allow-status">
            <text class="status-text">已授权</text>
          </view>
          <view v-if="report.isGenerating" class="generating-badge">
            <text class="generating-text">生成中</text>
          </view>
          <view v-else class="report-status">
            <text class="status-text">已完成</text>
          </view>
          <button class="action-button view-button" @tap.stop="viewReportDetails(report)">查看</button>
          <button class="action-button delete-button" @tap.stop="confirmDeleteReport(report.reportId)">
            删除
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getChildDetails } from '@/api/child.js';
import { fetchChildReport, deleteReport, allowReport } from '@/api/report.js';

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
      return [...this.reports].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  onLoad(option) {
    this.childId = option.childId;
    console.log('Child ID:', this.childId);
    this.loadChildInfo();
    this.loadReports();
  },
  methods: {
    async authorizeReport(reportId) {
      try {
        await allowReport(reportId);
        const reportIndex = this.reports.findIndex(r => r.reportId === reportId);
        if (reportIndex !== -1) {
          this.$set(this.reports[reportIndex], 'allowState', 'allow');
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
    async confirmDeleteReport(reportId) {
      // 显示弹出框
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该报告吗？此操作不可撤销。',
        success: async (res) => {
          if (res.confirm) {
            // 如果用户点击确认，则执行删除
            await this.deleteChildReport(reportId);
          } else if (res.cancel) {
            // 如果用户点击取消
            uni.showToast({
              title: '取消删除',
              icon: 'none',
            });
          }
        },
        fail: (error) => {
          console.error('弹出框显示失败:', error);
        }
      });
    },
    loadChildInfo() {
      getChildDetails(this.childId).then(child => {
        this.childName = child.name;
      }).catch(error => {
        console.error('加载孩子信息失败:', error);
        uni.showToast({
          title: '加载孩子信息失败',
          icon: 'none'
        });
      });
    },
    async loadReports() {
      try {
        const reports = await fetchChildReport(this.childId);
        this.reports = reports.map(report => {
          const dateArray = report.createdAt;
          const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
          
          // 手动格式化日期为中文格式
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const formattedDate = `${year}年${month}月${day}日`;

          return {
            reportId: report.reportId,
            date: formattedDate,
            reportType: report.reportType,
            isGenerating: report.state === '检测中',
            analyse: report.analyse,
            result: report.result,
            url: report.url,
            comment: report.comment,
            doctorId: report.doctorId,
            allowState: report.allowState,
          };
        });
      } catch (error) {
        console.error('加载报告失败:', error);
        uni.showToast({
          title: '加载报告失败',
          icon: 'none'
        });
      }
    },
    viewReportDetails(report) {
      if (!report) {
        console.error("Report data is undefined");
        uni.showToast({
          title: '报告数据不存在',
          icon: 'none'
        });
        return;
      }

      if (!report.isGenerating) {
        const params = encodeURIComponent(JSON.stringify(report));
        uni.navigateTo({
          url: `/pages/reportDetails/reportDetails?report=${params}`,
        });
      } else {
        uni.showToast({
          title: '报告正在生成中，请稍后查看',
          icon: 'none'
        });
      }
    },
    async deleteChildReport(reportId) {
      try {
        await this.deleteReport(reportId);
        this.reports = this.reports.filter(report => report.reportId !== reportId);
        uni.showToast({
          title: '报告已删除',
          icon: 'success',
        });
      } catch (error) {
        console.error('删除报告失败:', error);
        uni.showToast({
          title: '删除报告失败',
          icon: 'none',
        });
      }
    },
    async deleteReport(reportId) {
      await deleteReport(reportId);
    }
  }
}
</script>

<style>
.auth-button {
  background-color: #52c41a;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 15px;
  color: #ffffff;
}

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

.no-reports {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 16px;
  color: #999;
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
  flex: 1;
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

.report-status-and-actions {
  display: flex;
  align-items: center;
}

.generating-badge,
.allow-status,
.report-status {
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 10px;
}

.generating-badge {
  background-color: #ff3b30;
}

.report-status {
  background-color: #4cd964;
}

.allow-status {
  background-color: #333;
}

.generating-text,
.status-text {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.action-button {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  margin-left: 5px;
}

.view-button {
  background-color: #007aff;
  color: #ffffff;
}

.delete-button {
  background-color: #ff3b30;
  color: #ffffff;
}
</style>
