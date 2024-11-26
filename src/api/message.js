import request from '@/utils/request';

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
        url: `/api/messages/last30/${relationId}`,
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
      return data;
    })
    .catch(err => {
      console.error('请求过程中出现错误:', err);
      throw err;
    });
}