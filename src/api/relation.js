import request from '@/utils/request'; // 假设你有一个用于封装请求的工具函数

// 绑定医生和患者关系
export function bindDoctorPatientRelation(doctorId, childId) {
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

