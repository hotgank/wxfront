import { BASE_URL } from '@/utils/request.js';

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
