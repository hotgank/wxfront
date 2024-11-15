// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import { getAllDoctors } from '@/api/doctor.js'; // 引入封装好的请求
import { getAllChildrenProfiles, getChildDetails, addChildProfile, updateChildProfile, deleteChildProfile } from '@/api/child.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    doctors: [], // 用于存储医生列表数据
    childrenProfiles: [], // 存储所有孩子的档案信息
  },
  mutations: {
    setDoctors(state, doctors) {
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
      }
  },
  actions: {
    async loadDoctors({ commit, state }) {
      // 如果已经有医生数据，则不再请求
      if (state.doctors.length > 0) {
        return state.doctors;
      }

      try {
        const doctors = await getAllDoctors();
        commit('setDoctors', doctors); // 将数据存入 state
        return doctors;
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
