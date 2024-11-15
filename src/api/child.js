// src/api/child.js
import request from '@/utils/request.js';

// 获取所有孩子的档案
export const getAllChildrenProfiles = async () => {
  try {
    const response = await request({
      url: '/api/parentChildRelation/selectAllRelations',
      method: 'POST'
    });

    if (response[0]) {
      throw new Error('获取孩子档案失败');
    }
    console.log("获取档案成功");
    const rawData = response[1];
    const processedData = rawData.map(item => ({
      childId: item.childId,
      relationId: item.relationId
    }));

    return processedData;
  } catch (error) {
    console.error('获取孩子档案失败:', error.message);
    throw error;
  }
};

// 根据 childId 获取孩子的详细信息
export const getChildDetails = async (childId) => {
  try {
    const response = await request({
      url: `/api/children/selectById`,
      method: 'POST',
      data: { childId } // 将 childId 放在请求体中作为 JSON 格式的数据
    });

    if (response[0]) {
      throw new Error('获取孩子详细信息失败');
    }

    return response[1]; // 返回获取的孩子详细信息
  } catch (error) {
    console.error('获取孩子详细信息失败:', error.message);
    throw error;
  }
};

// 添加孩子档案
export const addChildProfile = async (childData) => {
  try {
    const response = await request({
      url: '/api/children/createChild',
      method: 'POST',
      data: childData
    });

    if (response[0]) {
      throw new Error('添加孩子档案失败');
    }

    return response[1].relationId; // 返回生成的 relationId
  } catch (error) {
    console.error('添加孩子档案失败:', error.message);
    throw error;
  }
};
export const updateChildProfile = async (childData) => {
  try {
    const response = await request({
      url: '/api/children/update',
      method: 'POST',
      data: childData
    });

    if (response[0]) {
      throw new Error('更新孩子信息失败');
    }

    console.log('孩子信息更新成功');
    return response[1]; // 返回更新后的结果或状态
  } catch (error) {
    console.error('更新孩子信息失败:', error.message);
    throw error;
  }
};
//删除孩子档案
export const deleteChildProfile = async (childId) => {
  try {
    const response = await request({
      url: '/api/children/delete',
      method: 'POST',
      data: { childId } // 将 childId 作为请求体传递
    });

    if (response[0]) {
      throw new Error('删除孩子档案失败');
    }

    console.log('删除成功');
    return response[1];
  } catch (error) {
    console.error('删除孩子档案失败:', error.message);
    throw error;
  }
};




