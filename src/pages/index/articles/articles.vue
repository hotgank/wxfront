<template>
  <div class="container">
    <h1 class="page-title">科普文章</h1>
    <div class="article-grid">
      <div v-for="article in healthArticles" :key="article.articleId" class="article-card"
        @tap="goToArticleDetail(article.articleId)">
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
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['healthArticles', 'articleDoctors']),
  },
  methods: {
    ...mapActions(['loadHealthArticles', 'loadDoctorInfo']),
    async goToArticleDetail(articleId) {
      uni.navigateTo({
        url: `/pages/index/articles/articleDetails/articleDetails?id=${articleId}`,
      });
    },
  },
  async onLoad() {
    try {
      // 加载文章列表
      await this.loadHealthArticles();

      // 加载每篇文章的医生信息
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
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}


.article-card {
background-color:#ffffff;
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

@media (max-width: 768px) {
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