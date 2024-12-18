// src/api/doctor.js
import request from '@/utils/request.js';
import { BASE_URL } from '@/utils/request.js';
// 查询所有医生
export const getAllDoctors = async () => {
  try {
    const response = await request({
      url: '/api/user/selectAllQualifiedDoctors',
      method: 'POST',
      data: {} // 空请求体
    });

    if (response[0]) {
      throw new Error('获取医生信息失败');
    }

    let doctors = response[1];

    // 检查 doctors 是否为数组
    if (!Array.isArray(doctors)) {
      throw new Error('返回的数据格式不正确');
    }

    // 替换 avatarUrl 的前缀
    doctors = doctors.map(doctor => {
      if (doctor.avatarUrl && doctor.avatarUrl.startsWith('http://localhost:8080')) {
        return {
          ...doctor,
          avatarUrl: doctor.avatarUrl.replace('http://localhost:8080', `${BASE_URL}`)
        };
      }
      return doctor;
    });

    console.log("医生信息:", doctors);
    return doctors;
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

    let doctors = data;

    // 检查 doctors 是否为数组
    if (!Array.isArray(doctors)) {
      throw new Error('返回的数据格式不正确');
    }

    // 替换 avatarUrl 的前缀
    doctors = doctors.map(doctor => {
      if (doctor.avatarUrl && doctor.avatarUrl.startsWith('http://localhost:8080')) {
        return {
          ...doctor,
          avatarUrl: doctor.avatarUrl.replace('http://localhost:8080', `${BASE_URL}`)
        };
      }
      return doctor;
    });

    console.log("我的医生信息:", doctors);
    return doctors;
  } catch (error) {
    console.error('获取我的医生列表失败:', error.message);
    throw error; // 将错误抛出，供调用方捕获
  }
};
