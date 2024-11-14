// src/api/login.js
import request from '@/utils/request.js';

export const login = async () => {
    try {
        // 1. 调用 wx.login 获取 code
        const loginRes = await new Promise((resolve, reject) => {
            wx.login({
                success: resolve,
                fail: reject
            });
        });

        if (!loginRes.code) {
            throw new Error('微信登录失败');
        }

        const code = loginRes.code;

        // 2. 获取用户信息
        const userInfoRes = await new Promise((resolve, reject) => {
            wx.getUserInfo({
                success: resolve,
                fail: reject
            });
        });

        const { encryptedData, iv } = userInfoRes;

        // 3. 将 code、encryptedData 和 iv 发送到后端进行验证
        const response = await request({
            url: '/api/userLogin/weChatUserLogin',
            method: 'POST',
            data: {
                code: code,
                encryptedData: encryptedData,
                iv: iv
            }
        });

        if (response[0]) {
            throw new Error('登录请求失败');
        }

        const { token } = response[1];
        const expiryTime = Date.now() + 5 * 60 * 60 * 1000;
        uni.setStorageSync('token', token);
        uni.setStorageSync('token_expiry', expiryTime);

        console.log('登录成功, token:', token);
        return { token };
    } catch (error) {
        console.error('登录失败:', error.message);
        throw error; // 将错误抛出给调用者处理
    }
};
