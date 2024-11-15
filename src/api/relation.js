import request from '@/utils/request'; // 假设你有一个用于封装请求的工具函数

// 绑定医生和患者关系
export function bindDoctorPatientRelation(doctorId, childId) {
  return request({
    url: '/api/doctor/relation/add',
    method: 'POST',
    data: {
      doctorId: doctorId,
      childId: childId
    }
  });
}
