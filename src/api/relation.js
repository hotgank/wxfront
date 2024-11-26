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

export function removeConsultationBinding(doctorId) {
  if (!doctorId ) {
    return Promise.reject(new Error('doctorId  is required parameters'));
  }

  return request({
    url: '/api/doctor/relation/removeBinding',
    method: 'POST',
    data: {
      doctorId,
    },
  })
    
}








