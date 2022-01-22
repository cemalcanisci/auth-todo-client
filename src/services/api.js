/* eslint-disable dot-notation */
/* eslint-disable no-param-reassign */
import axios from 'axios';

const config = {
  baseURL: process.env.VUE_APP_TODO_SERVICE_URL || 'http://localhost:3000',
};
class Api {
  constructor() {
    this.api = axios.create(config);

    this.setToken();
  }

  setToken() {
    this.api.interceptors.request.use((axiosConfig) => {
      const token = localStorage.getItem('token');

      if (token) {
        axiosConfig.headers.common['Authorization'] = `Bearer ${token}`;
      }

      return axiosConfig;
    });
  }

  login(payload) {
    return this.api.post('/api/user/login', payload);
  }

  register(payload) {
    return this.api.post('/api/user/register', payload);
  }

  fetchUser() {
    return this.api.get('/api/user/fetch');
  }

  fetchGroups() {
    return this.api.get('/api/group/fetch');
  }

  addGroup(payload) {
    return this.api.post('/api/group/add', payload);
  }

  editGroup({ id, payload }) {
    return this.api.put(`/api/group/edit/${id}`, payload);
  }

  deleteGroup(id) {
    return this.api.delete(`/api/group/delete/${id}`);
  }

  fetchTodos(query = {}) {
    const params = new URLSearchParams(query).toString();
    return this.api.get(`/api/todo/fetch?${params}`);
  }

  addTodo(payload) {
    return this.api.post('/api/todo/add', payload);
  }

  updateStatus(id, payload) {
    return this.api.put(`/api/todo/update-status/${id}`, payload);
  }

  editTodo(id, payload) {
    return this.api.put(`/api/todo/edit/${id}`, payload);
  }

  deleteTodo(id) {
    return this.api.delete(`/api/todo/delete/${id}`);
  }
}

export default new Api();
