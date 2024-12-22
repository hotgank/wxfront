<template>
  <div class="container">
    <h1 class="page-title">科普文章</h1>
    <!-- 添加搜索框和筛选下拉框 -->
    <div class="search-filter-container">
      <div class="filter-box">
        <picker 
          mode="selector" 
          :range="articleTypes" 
          @change="onTypeChange" 
          class="type-picker"
        >
          <view class="picker-wrapper">
            <text class="picker-text">{{ selectedType || '选择类型' }}</text>
            <text class="picker-icon">▼</text>
          </view>
        </picker>
        <button v-if="selectedType" @click="clearType" class="clear-filter-button">清除</button>
      </div>
      <div class="search-container">
        <div class="search-box">
          <img src="/static/icons/search.png" class="search-icon" alt="搜索图标" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索文章标题..." 
            class="search-input"
          >
          <div 
            v-if="searchQuery" 
            class="clear-button"
            @click="clearSearch"
          >
            ✕
          </div>
        </div>
      </div>
    </div>
    <div class="article-grid">
      <div v-for="article in filteredArticles" :key="article.articleId" class="article-card"
        @click="goToArticleDetail(article.articleId)">
        <div class="article-header">
          <img
            :src="articleDoctors[article.articleId] && articleDoctors[article.articleId].avatar || '/static/doctor-avatars/default.jpg'"
            alt="Doctor Avatar" class="doctor-avatar">
          <div class="article-title-type">
            <h2 class="article-title">{{ article.title }}</h2>
            <span class="article-type">{{ article.type }}</span>
          </div>
        </div>
        <div class="article-info">
          <div class="info-item">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>{{ articleDoctors[article.articleId] && articleDoctors[article.articleId].name || '加载中...' }}</span>
          </div>
          <div class="info-item">
            <svg class="icon" viewBox="0 0 24 24">
              <path
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
              </path>
            </svg>
            <span>{{ articleDoctors[article.articleId] && articleDoctors[article.articleId].hospital || '加载中...'
              }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 无搜索结果提示 -->
    <div v-if="filteredArticles.length === 0" class="no-results">
      <svg class="no-results-icon" viewBox="0 0 24 24">
        <path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"/>
        <path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"/>
      </svg>
      <p>未找到相关文章</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      searchQuery: '',
      selectedType: '', // 用于存储选中的文章类型
      articleTypes: [
        '全部类型',
        '脊柱侧弯',
        '高低肩',
        '骨盆侧倾',
        '足部健康与矫正',
        '姿势矫正',
        '运动与康复',
        '青少年骨骼发育',
        '其他'
      ], // 静态定义的文章类型
    }
  },
  computed: {
    ...mapState(['healthArticles', 'articleDoctors']),
    // 根据搜索查询和选中的类型过滤文章
    filteredArticles() {
      let articles = this.healthArticles;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        articles = articles.filter(article => 
          article.title.toLowerCase().includes(query)
        );
      }

      if (this.selectedType && this.selectedType !== '全部类型') {
        articles = articles.filter(article => article.type === this.selectedType);
      }

      return articles;
    }
  },
  methods: {
    ...mapActions(['loadHealthArticles', 'loadDoctorInfo']),
    async goToArticleDetail(articleId) {
      uni.navigateTo({
        url: `/pages/index/articles/articleDetails/articleDetails?id=${articleId}`,
      });
    },
    clearSearch() {
      this.searchQuery = '';
    },
    onTypeChange(e) {
      const index = e.detail.value;
      this.selectedType = this.articleTypes[index];
    },
    clearType() {
      this.selectedType = '';
    }
  },
  async onLoad() {
    try {
      await this.loadHealthArticles();
      await this.loadDoctorInfo();
    } catch (error) {
      console.error('加载文章或医生信息失败:', error);
      uni.showToast({
        title: '加载失败，请稍后重试',
        icon: 'none',
      });
    }
  },
};
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: #333;
  position: relative;
}

.page-title::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #0066cc;
  margin: 10px auto 0;
}

.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filter-box .picker-wrapper {
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

.filter-box .picker-wrapper:active {
  background-color: #f8f8f8;
  transform: translateY(1px);
}

.filter-box .picker-text {
  font-size: 14px;
  color: #333;
}

.filter-box .picker-icon {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s ease;
}

.clear-filter-button {
  margin-left: 10px;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.clear-filter-button:hover {
  background-color: #d9d9d9;
}

.search-container {
  flex: 1;
  display: flex;
  justify-content: center;
  margin-left: 20px;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
  padding: 0;
}

.search-input::placeholder {
  color: #999;
}

.clear-button {
  cursor: pointer;
  padding: 4px 8px;
  color: #999;
  font-size: 14px;
  transition: color 0.3s ease;
}

.clear-button:hover {
  color: #666;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.article-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.doctor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 2px solid #e6f3ff;
}

.article-title-type {
  flex: 1;
}

.article-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.article-type {
  display: inline-block;
  background-color: #e6f3ff;
  color: #0066cc;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 20px;
}

.article-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e6e6e6;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.no-results {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.no-results-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  fill: #999;
}

.no-results p {
  font-size: 16px;
  color: #666;
}

@media (max-width: 768px) {
  .search-filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-box {
    margin-bottom: 20px;
  }

  .search-container {
    margin-left: 0;
  }

  .article-grid {
    grid-template-columns: 1fr;
  }

  .article-card {
    padding: 15px;
  }

  .doctor-avatar {
    width: 50px;
    height: 50px;
  }

  .article-title {
    font-size: 16px;
  }
}
</style>
