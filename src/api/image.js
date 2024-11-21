import { BASE_URL } from '@/utils/request.js';
import  request  from '@/utils/request.js';
export const uploadImage = async (filePath) => {
  try {
    const token = uni.getStorageSync('token'); // 获取 token
    const url = `${BASE_URL}/api/image/upload`; // 动态构建上传 URL

    const response = await uni.uploadFile({
      url: url, // 上传图片的接口地址
      filePath: filePath,
      name: 'file', // 对应后端的文件字段名
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // 使用获取到的 token
      },
    });

    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log('图片上传成功:', data.imageUrl);
      return data.imageUrl; // 返回图片的 URL
    } else {
      console.error('图片上传失败，状态码:', response.statusCode);
      throw new Error('图片上传失败');
    }
  } catch (error) {
    console.error('图片上传出错:', error.message);
    throw error;
  }
};
/**
 * 获取医生头像
 * @param {string} avatarUrl - 医生头像的路径（相对路径或完整 URL）
 * @returns {Promise} 返回一个 Promise，解析为图片 Blob 数据
 */
export const getDoctorAvatar = (avatarUrl) => {
  return request({
    url: `/api/url/base64`,
    method: 'GET',
    params: { url: avatarUrl },
  }).then(([error, response]) => {
    if (error) {
      console.error('获取医生头像失败:', error);
      return null;
    }

    return response;
  });
};