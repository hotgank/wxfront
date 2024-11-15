// src/api/doctor.js
import request from '@/utils/request.js';

// 查询所有医生
export const getAllDoctors = async () => {
  try {
    const response = await request({
      url: '/api/doctor/selectAll',
      method: 'POST',
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