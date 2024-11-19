import request from '@/utils/request'
export function deleteReport(reportId) {
    return request({
      url: '/api/userReport/deleteByReportId',
      method: 'POST',
      data: { reportId },
    })
      .then(response => {
        console.log('删除报告成功', response);
        return response;
      })
      .catch(error => {
        console.error('删除报告失败', error);
        throw error;
      });
  }
  export const fetchChildReport = async (childId) => {
    try {
      const [error, response] = await request({
        url: '/api/userReport/selectByChildId',
        method: 'POST',
        data: { childId }
      });
  
      if (error) {
        console.error('查询孩子检测报告失败:', error);
        throw new Error('查询失败');
      }
      
      console.log('孩子检测报告:', response);
      return response; // 返回查询到的报告数据
    } catch (err) {
      console.error('请求过程中出错:', err.message);
      throw err;
    }
  };
  export function selectAllReports() {
    return request({
      url: '/api/userReport/selectAll',
      method: 'GET',
    })
      .then(response => {
        console.log('查询全部成功', response[1]);
        return response[1];
      })
      .catch(error => {
        console.error('查询全部失败', error);
        throw error;
      });
  }