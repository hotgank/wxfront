import { BASE_URL } from '@/utils/request.js';
import  request  from '@/utils/request.js';
export function uploadChatImageApi(filePath, relationId) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token'); // 从本地存储获取 token
    if (!relationId) {
      console.error('relationId 不能为空');
      reject(new Error('relationId is required'));
      return;
    }
    uni.uploadFile({
      url: `${BASE_URL}/api/image/uploadChatImage/${relationId}`, // 动态传入 relationId
      filePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // 使用获取到的 token
      },
      success: (uploadFileRes) => {
        try {
          // 解析服务器的 JSON 响应
          const data = JSON.parse(uploadFileRes.data);
          resolve(data); // 返回服务器响应数据
        } catch (err) {
          console.error('解析上传响应失败:', err);
          reject(err);
        }
      },
      fail: (err) => {
        console.error('上传文件失败:', err);
        reject(err);
      },
    });
  });
}

export async function uploadUserAvatar(avatarPath) {
  if (!avatarPath) {
    throw new Error('Avatar path is required');
  }

  try {
    const response = await uni.uploadFile({
      url: `${BASE_URL}/api/image/uploadUserAvatar`, // 替换为后端接口地址
      filePath: avatarPath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + uni.getStorageSync('token'), // 如果需要 token，可以从本地存储中获取
      },
    });

    const resData = JSON.parse(response.data);
    if (response.statusCode === 200) {
      return resData.message; // 返回成功消息
    } else {
      throw new Error(resData.message || '上传失败');
    }
  } catch (error) {
    console.error('上传头像失败:', error);
    throw new Error(error.message || '上传头像失败');
  }
}
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
