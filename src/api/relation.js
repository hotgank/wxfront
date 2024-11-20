import request from '@/utils/request'; // 假设你有一个用于封装请求的工具函数

// 绑定医生和患者关系
export function bindDoctorPatientRelation(doctorId) {
  return request({
    url: '/api/doctor/relation/add',
    method: 'POST',
    data: {
      doctorId: doctorId,
    }
  });
}
// 引入封装的请求工具

// 查询申请记录
export const getSelectApplication = (params = {}) => {
  return request({
    url: '/api/doctor/relation/selectApplication', // 接口路径
    method: 'GET', // HTTP 方法 
  });
};
export async function selectRelationIdByDoctorId(doctorId) {
  try {
    if (!doctorId) {
      throw new Error('doctorId 不能为空');
    }

    console.log('测试开始: 请求 selectRelationIdByDoctorId', doctorId);

    const response = await request({
      url: '/api/doctor/relation/selectRelationIdByDoctorId',
      method: 'POST',
      data: {
        doctorId,
      },
    });

    console.log('请求成功:', response);

    // 验证响应是否为数组格式
    if (response && Array.isArray(response)) {
      const relationId = response[1]; // 获取数组中的第二个元素
      if (relationId) {
        console.log('解析的 relationId:', relationId);
        return relationId;
      } else {
        throw new Error('relationId 不存在或为空');
      }
    } else {
      throw new Error('服务器返回的响应格式不正确');
    }
  } catch (error) {
    console.error('请求失败:', error.message || error);
    throw error;
  }
}



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
export async function sendMessageApi(relationId, senderType = 'user', messageText, messageType = 'text', url = null) {
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





