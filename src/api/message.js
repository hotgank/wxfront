import request from '@/utils/request';
import { BASE_URL } from '../utils/request';
/**
 * 获取指定消息序列号之后的信息
 * @param {String} relationId - 消息关联 ID，必传
 * @param {Number} messageSeq - 消息序列号，必传
 * @returns {Promise} - 返回包含消息记录的 Promise
 */
export const getMessagesAfter = (relationId, messageSeq) => {
  if (!relationId || !messageSeq) {
    return Promise.reject(new Error('relationId 和 messageSeq 是必传参数'));
  }

  return request({
    url: `/api/messages/after/${relationId}/${messageSeq}`,
    method: 'GET',
  });
};
export async function getLast30Messages(relationId) {
    try {
      if (!relationId) {
        throw new Error('relationId 不能为空');
      }
  
      console.log('relationId:', relationId); // 打印 relationId，确保其不为空
  
      const response = await request({
        url: `/api/messages/new30/${relationId}`,
        method: 'GET',
      });
  
      // 验证响应结构
      if (response && Array.isArray(response) && response.length > 1) {
        const messages = response[1]; // 假设实际消息数组在 response[1] 中
        if (Array.isArray(messages)) {
          console.log('获取消息成功:', messages);
          return messages; // 返回消息数组
        } else {
          throw new Error('服务器返回的消息数据格式不正确');
        }
      } else {
        console.error('服务器返回异常:', response); // 打印异常响应
        throw new Error('服务器返回数据格式异常');
      }
    } catch (error) {
      console.error('获取消息失败:', error);
      throw error; // 抛出错误供上层捕获
    }
  }
  // 封装发送消息请求的函数
  export async function sendMessageApi(relationId, senderType = 'user', messageText, messageType , url = null) {
    try {
      if (!relationId || !messageText) {
        throw new Error('缺少必要参数：relationId 或 messageText');
      }
  
      const requestBody = {
        relationId,
        senderType,
        messageText,
        messageType,
        url,
      };
  
      console.log('发送消息请求体:', requestBody);
  
      const response = await request({
        url: '/api/messages/send',
        method: 'POST',
        data: requestBody,
      });
      return response;
  
      // 适配返回结果，提取数组中的消息对象
    } catch (error) {
      console.error('发送消息失败:', error.message);
      throw error;
    }
  }
  /**
 * 获取指定消息序列号之前的15条信息
 * @param {String} relationId - URL参数，关系ID
 * @param {Number} messageSeq - URL参数，消息序列号
 * @returns {Promise} 请求返回数据
 */
export function getMessagesBefore(relationId, messageSeq) {
  if (!relationId || !messageSeq) {
    return Promise.reject(new Error('relationId 和 messageSeq 是必传参数'));
  }

  return request({
    url: `/api/messages/before/${relationId}/${messageSeq}`,
    method: 'GET',
  });
  }
 

/**
 * 获取最后消息
 * @returns {Promise<Object>} 返回最后消息的 Promise 对象
 */
export function getLastMessage() {
  return request({
    url: '/api/messages/lastMessage',
    method: 'GET',
  })
    .then(([error, data]) => {
      if (error) {
        console.error('获取最后消息失败:', error);
        throw error;
      }
      let messages = data;
      
          // 检查 doctors 是否为数组
          if (!Array.isArray(messages)) {
            throw new Error('返回的数据格式不正确');
          }
      
          // 替换 avatarUrl 的前缀
          messages = messages.map(message => {
            if (message.doctor.avatarUrl && message.doctor.avatarUrl.startsWith('http://localhost:8080')) {
              return {
                ...message,
                doctor: {
                  ...message.doctor,
                  avatarUrl: message.doctor.avatarUrl.replace('http://localhost:8080', `${BASE_URL}`)
                }
              };
            }
            return message;
          });
      
          console.log("我的最后聊天信息:", messages);
          return messages;
    })
    .catch(err => {
      console.error('请求过程中出现错误:', err);
      throw err;
    });
}

/**
 * 更新Redis中的已读消息序列号
 * @param {number} relationId - 关系ID
 * @param {number} readSeq - 已读消息的序列号
 * @returns {Promise<string>} - 返回包含更新结果的 Promise
 */
export async function updateReadInfo(relationId, readSeq) {
  if (!relationId || typeof readSeq !== 'number') {
    throw new Error('relationId 和 readSeq 是必传参数，且 readSeq 必须为数字');
  }

  try {
    const [error, data] = await request({
      url: '/api/messages/updateReadInfo',
      method: 'POST',
      data: {
        relationId,
        ReadSeq: readSeq
      }
    });

    if (error) {
      console.error('更新已读消息序列号失败:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('请求过程中出现错误:', err);
    throw err;
  }
}

/**
 * 获取未读消息信息数量
 * @param {number} relationId - 关系ID
 * @returns {Promise<{DoctorUnread: number, UserUnread: number}>} - 返回包含未读消息信息的 Promise
 */
export async function getUnreadInfo(relationId) {
  if (!relationId || typeof relationId !== 'number') {
    throw new Error('relationId 是必传参数，且必须为数字');
  }

  try {
    const [error, data] = await request({
      url: '/api/messages/getUnReadInfo',
      method: 'POST',
      data: {
        relationId
      }
    });

    if (error) {
      console.error('获取未读消息信息失败:', error);
      throw error;
    }

    // 确保返回的数据符合预期格式
    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        if ('DoctorUnread' in parsedData && 'UserUnread' in parsedData) {
          return {
            DoctorUnread: Number(parsedData.DoctorUnread),
            UserUnread: Number(parsedData.UserUnread)
          };
        }
      } catch (parseError) {
        console.error('解析返回数据失败:', parseError);
      }
    } else if (typeof data === 'object' && 'DoctorUnread' in data && 'UserUnread' in data) {
      return {
        DoctorUnread: Number(data.DoctorUnread),
        UserUnread: Number(data.UserUnread)
      };
    }

    throw new Error('服务器返回的数据格式不正确');
  } catch (err) {
    console.error('请求过程中出现错误:', err);
    throw err;
  }
}