import Vue from 'vue';
import Vuex from 'vuex';
import { getAllDoctors } from '@/api/doctor.js';
import { getAllChildrenProfiles, getChildDetails, addChildProfile, updateChildProfile, deleteChildProfile } from '@/api/child.js';
import { getAllHealthArticles, getDoctorDetails } from '@/api/healthArticle.js'; // 引入获取科普文章的 API
import { getDoctorAvatar } from '@/api/image.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    doctors: [], // 医生列表
    childrenProfiles: [], // 孩子档案
    healthArticles: [],// 科普文章列表
    articleDoctors: {}, // 存储文章对应的医生信息
  },
  mutations: {
    setArticleDoctor(state, { articleId, doctor }) {
      Vue.set(state.articleDoctors, articleId, doctor);
    },
    setDoctors(state, doctors) {
      state.doctors = doctors;
    },
    updateDoctors(state, doctors) {
      state.doctors = doctors;
    },
    setChildrenProfiles(state, profiles) {
      state.childrenProfiles = profiles;
    },
    addChildProfile(state, newProfile) {
      state.childrenProfiles.push(newProfile);
    },
    updateChildProfile(state, updatedChild) {
      const index = state.childrenProfiles.findIndex(child => child.childId === updatedChild.childId);
      if (index !== -1) {
        Vue.set(state.childrenProfiles, index, updatedChild);
      }
    },
    removeChildProfile(state, childId) {
      state.childrenProfiles = state.childrenProfiles.filter(child => child.childId !== childId);
    },
    setHealthArticles(state, articles) {
      state.healthArticles = articles;
    }
  },
  actions: {
    // 加载文章对应的医生信息
    async loadDoctorInfo({ commit, state }) {
      try {
        const promises = state.healthArticles.map(async (article) => {
          const doctor = await getDoctorDetails(article.articleId); // 调用 API 获取医生信息
          commit('setArticleDoctor', {
            articleId: article.articleId,
            doctor: {
              name: doctor.name || '未知医生',
              hospital: doctor.workplace || '未知医院',
              avatar: doctor.avatar || '',
            },
          });
        });

        await Promise.all(promises); // 并行加载所有医生信息
      } catch (error) {
        console.error('加载医生信息失败:', error.message);
        throw error;
      }
    },
    async fetchDoctorDetails({ commit }, articleId) {
      try {
        const doctorDetails = await getDoctorDetails(articleId);
        return doctorDetails; // 返回医生信息供组件使用
      } catch (error) {
        console.error('获取医生信息失败:', error.message);
        throw error;
      }
    },
    async loadDoctors({ commit, state }) {
      if (state.doctors.length > 0) {
        //return state.doctors;
        //清理旧数据
        commit('setDoctors', []);
      }

      try {
        // 获取医生数据
        const doctors = await getAllDoctors();

        // 更新头像
        const updatedDoctors = await Promise.all(
          doctors.map(async (doctor) => {
            if (doctor.avatarUrl) {
              try {
                // 调用 getDoctorAvatar 获取 Base64 格式的头像
                const base64Avatar = await getDoctorAvatar(doctor.avatarUrl);
                doctor.avatarUrl = base64Avatar || doctor.avatarUrl; // 请求失败时保留原始 URL
              } catch {
                console.error(`获取医生 ${doctor.doctorId} 的头像失败`);
              }
            }
            return doctor;
          })
        );

        // 提交到 Vuex 的 state
        commit('setDoctors', updatedDoctors);
        return updatedDoctors;
      } catch (error) {
        console.error('加载医生信息失败:', error.message);
        throw error;
      }
    },
    async loadChildrenProfiles({ commit }) {
      try {
        const basicProfiles = await getAllChildrenProfiles();
        const detailedProfiles = await Promise.all(
          basicProfiles.map(async (profile) => {
            const details = await getChildDetails(profile.childId);
            const age = calculateAge(details.birthdate);
            return { ...details, relationId: profile.relationId, age, childId: profile.childId };
          })
        );
        commit('setChildrenProfiles', detailedProfiles);
      } catch (error) {
        console.error('加载孩子档案失败:', error.message);
        throw error;
      }
    },
    async addChildProfile({ commit }, childData) {
      try {
        const relationId = await addChildProfile(childData);
        commit('addChildProfile', { ...childData, relationId });
      } catch (error) {
        console.error('添加档案失败:', error.message);
        throw error;
      }
    },
    async updateChildProfile({ commit }, childData) {
      try {
        await updateChildProfile(childData);
        commit('updateChildProfile', childData);
      } catch (error) {
        console.error('更新档案失败:', error.message);
        throw error;
      }
    },
    async deleteChildProfile({ commit }, childId) {
      try {
        await deleteChildProfile(childId);
        commit('removeChildProfile', childId);
      } catch (error) {
        console.error('删除档案失败:', error.message);
        throw error;
      }
    },
    async loadHealthArticles({ commit }) {
      try {
        const articles = await getAllHealthArticles(); // 调用获取文章的 API
        commit('setHealthArticles', articles); // 存储到 state 中
        return articles;
      } catch (error) {
        console.error('加载科普文章失败:', error.message);
        throw error;
      }
    }
  }
});

function calculateAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default store;
