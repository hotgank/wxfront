import request from '@/utils/request.js';

export const aiDetect = async (childId, imageUrl,type) => {
  try {
    const response = await request({
      url: '/api/ai/detect',
      method: 'POST',
      data: {
        childId: childId,
        imageUrl: imageUrl,
        type:type
        
      }
    });
    console.log('AI检测上传成功');
    return response; // Assuming the API response contains the detection report
  } catch (error) {
    console.error('AI检测失败:', error.message);
    throw error;
  }
};
