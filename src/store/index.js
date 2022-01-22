/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable no-empty-pattern */
import Vue from 'vue';
import Vuex from 'vuex';

import api from '@/services/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    todos: [],
    groups: [],
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_GROUPS(state, payload) {
      state.groups = payload;
    },
    ADD_GROUP(state, payload) {
      state.groups.push(payload);
    },
    SET_TODOS(state, payload) {
      state.todos = payload;
    },
  },
  actions: {
    logout({ commit }) {
      localStorage.removeItem('token');
      commit('SET_USER', null);
    },
    async login({ dispatch }, payload) {
      const res = await api.login(payload);
      const { data } = res;
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      await dispatch('fetchUser');
    },
    register({}, payload) {
      return api.register(payload);
    },
    async fetchUser({ commit }) {
      const res = await api.fetchUser();
      commit('SET_USER', res.data.user);
    },
    async fetchGroups({ commit }) {
      const res = await api.fetchGroups();
      commit('SET_GROUPS', res.data.data);
    },
    async addGroup({ commit }, payload) {
      const res = await api.addGroup(payload);
      commit('ADD_GROUP', res.data.data);
    },
    async editGroup({}, data) {
      await api.editGroup(data);
    },
    async deleteGroup({}, id) {
      await api.deleteGroup(id);
    },
    async fetchTodos({ commit }, query) {
      const res = await api.fetchTodos(query);
      commit('SET_TODOS', res.data.data);
    },
    async addTodo({}, payload) {
      await api.addTodo(payload);
    },
    async editTodo({}, data) {
      const { id, payload } = data;
      await api.editTodo(id, payload);
    },
    async deleteTodo({}, id) {
      await api.deleteTodo(id);
    },
    async updateTodoStatus({}, data) {
      const { id, payload } = data;
      await api.updateStatus(id, payload);
    },
  },
  getters: {
    getGroupByValue:
      (state) =>
      (value, type = 'id') => {
        const index = state.groups.findIndex((group) => group[type] === value);
        return state.groups[index];
      },
  },
});
