// src/api/doctor.js
import request from '@/utils/request.js';

// 查询所有医生
export const getAllDoctors = async () => {
  try {
    const response = await request({
      url: '/api/doctor/selectAll',
      method: 'GET',
      data: {} // 空请求体
    });

    if (response[0]) {
      throw new Error('获取医生信息失败');
    }

    console.log("医生信息:", response[1]);
    return response[1];
  } catch (error) {
    console.error('获取医生信息失败:', error.message);
    throw error;
  }
};
export const getMyDoctors = async () => {
  try {
    const [error, data] = await request({
      url: '/api/doctor/relation/selectMyDoctors',
      method: 'GET',
    });

    if (error) {
      throw new Error('获取医生列表失败');
    }

    return data; // 返回医生列表数据
  } catch (error) {
    console.error('获取医生列表失败:', error.message);
    throw error; // 将错误抛出，供调用方捕获
  }
};
