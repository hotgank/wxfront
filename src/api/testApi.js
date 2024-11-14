// src/api/testApi.js
import { getAllChildrenProfiles, getChildDetails, addChildProfile , updateChildProfile } from '@/api/child.js';

// const testGetAllChildrenProfiles = async () => {
//   try {
//     const profiles = await getAllChildrenProfiles();
//     console.log('获取所有孩子档案成功:', profiles);
//   } catch (error) {
//     console.error('获取所有孩子档案失败:', error.message);
//   }
// };
// const testAddChildProfile = async () => {
//   try {
//     const childData = {
//       name: '小明',
//       school: '示例小学',
//       gender: '男',
//       birthdate: '2014-11-10',
//       height: 140,
//       weight: 35
//     };
//     const relationId = await addChildProfile(childData);
//     console.log('添加孩子档案成功，生成的 relationId:', relationId);
//   } catch (error) {
//     console.error('添加孩子档案失败:', error.message);
//   }
// };
// const testGetChildDetails = async () => {
//   try {
//     const childId = 'C-09c3d90a-c168-43b1-b523-8558bc3790d5';
//     const details = await getChildDetails(childId);
//     console.log(`获取孩子（ID: ${childId}）详细信息成功:`, details);
//   } catch (error) {
//     console.error('获取孩子详细信息失败:', error.message);
//   }
// };
const testUpdateChildProfile = async () => {
  try {
    const childData = {
      childId: 'C-09c3d90a-c168-43b1-b523-8558bc3790d4', // 使用实际的 childId
      name: '小红',
      school: '更新后的小学',
      gender: '女',
      birthdate: '2015-09-12', // 确保日期格式正确
      height: 130,
      weight: 35
    };
    const response = await updateChildProfile(childData);
    console.log('编辑孩子档案成功:', response);
  } catch (error) {
    console.error('编辑孩子档案失败:', error.message);
  }
};


// 执行测试
// testGetAllChildrenProfiles();
// testGetChildDetails();
// testAddChildProfile();
testUpdateChildProfile();
