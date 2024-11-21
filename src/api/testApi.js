// src/api/testApi.js
import { getAllChildrenProfiles, getChildDetails, addChildProfile , updateChildProfile } from '@/api/child.js';
import { uploadImage } from '@/api/image.js';
import { getLast30Messages } from '@/api/relation.js';
import { selectRelationIdByDoctorId ,sendMessageApi} from '@/api/relation';
import { getDoctorAvatar } from '@/api/image'; // 引入封装好的头像请求函数

// 测试医生头像请求函数
const testGetDoctorAvatar = async () => {
  const avatarUrl = 'http://localhost:8080/doctor_avatars/D-d45b4b41-6465-437c-a8e6-8676f9e9a7d1.jpg';

  try {
    console.log('测试开始：请求医生头像...');

    // 调用函数，获取头像 base64 数据
    const base64Data = await getDoctorAvatar(avatarUrl);

    // 验证 Base64 数据是否存在
    if (!base64Data) {
      console.error('测试失败：未获取到头像 Base64 数据');
      return;
    }

    console.log('头像 Base64 数据获取成功:', base64Data);

    // 直接将图片的 Base64 数据赋值到图片的 src
   

    console.log('测试完成：头像图片已显示在页面中');
  } catch (error) {
    console.error('测试失败:', error);
  }
};

// 执行测试函数
// testGetDoctorAvatar();

// 测试函数
const testSelectRelationIdByDoctorId = async () => {
  try {
    const doctorId = 'D-d45b4b41-6465-437c-a8e6-8676f9e9a7d1'; // 替换为实际医生 ID
    console.log('测试开始: 请求 relationId');

    const relationId = await selectRelationIdByDoctorId(doctorId);
    console.log('测试成功: 获取 relationId:', relationId);
  } catch (error) {
    console.error('测试失败: 获取 relationId 出现错误:', error.message || error);
  }
};
async function testSendMessageApi() {
  try {
    const response = await sendMessageApi(
      5, // relationId
      'user', // senderType
      'This is a test message', // messageText
      'text', // messageType
      null // url
    );

    console.log('测试发送消息成功:', response);
  } catch (error) {
    console.error('测试发送消息失败:', error.message);
  }
}


// 执行测试
// testSendMessageApi();









// 调用测试函数



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
export const startUploadTest = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const filePath = res.tempFilePaths[0];
      console.log('选择的图片路径:', filePath);

      try {
        const imageUrl = await uploadImage(filePath);
        console.log('测试图片上传成功，返回的图片URL:', imageUrl);
      } catch (error) {
        console.error('测试图片上传失败:', error.message);
      }
    },
    fail: (err) => {
      console.error('选择图片失败:', err);
    },
  });
};
const testGetLast30Messages = async () => {
  try {
    // 替换为实际的 relationId
    const relationId = 5; // 使用你要测试的 relationId
    const messages = await getLast30Messages(relationId);
    console.log(`获取 relationId ${relationId} 的最后 30 条消息成功:`, messages);
  } catch (error) {
    console.error('获取消息失败:', error.message);
  }
};


// 调用 startUploadTest 来启动测试
// startUploadTest();

// testGetLast30Messages();
// testSelectRelationIdByDoctorId();
// 执行测试
// testGetAllChildrenProfiles();
// testGetChildDetails();
// testAddChildProfile();
// testUpdateChildProfile();
// startUploadTest();
