// src/api/healthArticle.js
import request from '@/utils/request.js';

// 获取所有科普文章
export const getDetails = async (articleId) => {
  try {
    const response = await request({
      url: '/api/healthArticle/details',
      method: 'POST',
      data: {
        articleId: articleId
      }
    });

    if (response[0]) {
      throw new Error('获取文章详情失败');
    }

    return response[1]; // 返回文章详情
  }
  catch (error) {
    console.error('获取文章详情失败:', error.message);
    throw error;
  }
 }
export const getAllHealthArticles = async () => {
  try {
    const response = await request({
      url: '/api/healthArticle/getAll',
      method: 'POST',
    });

    // 校验返回的数据是否有效
    if (!response || response.length === 0) {
      throw new Error('未获取到文章数据');
    }

    console.log('获取的文章列表:', response[1]);
    return response[1]; // 返回文章列表
  } catch (error) {
    console.error('获取科普文章失败:', error.message);
    throw error; // 将错误抛出，供调用方捕获
  }
};
//通过文章id查询医生详情
export const getDoctorDetails = async (articleId) => {
    try {
      const response = await request({
        url: '/api/healthArticle/getDoctorByArticleId',
        method: 'POST',
        data: {
          articleId: articleId
        }
      });
  
      if (response[0]) {
        throw new Error('获取医生信息失败');
      }
  
      console.log("医生信息:", response[1]);
      return response[1]
    } catch (error) {
      console.error('获取医生信息失败:', error.message);
      throw error;
    }
    
  }
