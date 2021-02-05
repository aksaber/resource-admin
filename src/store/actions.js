import Axios from '@/api/axios';
import Qs from 'qs';

export default {
    // 列表 - 学校管理
    UNIVERSITY_LIST({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.get(`/university/page?${data}`,)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 增加 - 学校管理
    UNIVERSITY_ADD({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.post(`/university/add`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 编辑 - 学校管理
    UNIVERSITY_UPDATE({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.post(`/university/update`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 列表 - 资源管理
    RESOURCE_LIST({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.get(`/resources/page?${data}`,)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 增加 - 资源管理
    RESOURCE_ADD({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.post(`/resources/add`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 编辑 - 资源管理
    RESOURCE_UPDATE({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.put(`/resources/update`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 删除 - 资源管理
    RESOURCE_DELETE({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.delete(`/resources/delete/${data}`)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 列表 - 课程管理
    COURSE_LIST({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.get(`/course/page?${data}`,)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 增加 - 课程管理
    COURSE_ADD({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.post(`/course/add`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 编辑 - 课程管理
    COURSE_UPDATE({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.put(`/course/update`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 删除 - 课程管理
    COURSE_DELETE({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.delete(`/course/delete/${data}`)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 批量删除 - 课程管理
    COURSE_DELBATCH({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.delete(`/course/batchDelete`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 列表 - 专业管理
    MAJOR_LIST({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.get(`/major/page?${data}`,)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 增加 - 专业管理
    MAJOR_ADD({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.post(`/major/add`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 编辑 - 专业管理
    MAJOR_UPDATE({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.put(`/major/update`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 删除 - 专业管理
    MAJOR_DELETE({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.delete(`/major/delete/${data}`)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 批量删除 - 专业管理
    MAJOR_DELBATCH({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.delete(`/major/batchDelete`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 列表 - 标签管理
    TAG_LIST({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.get(`/tag/page?${data}`,)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 增加 - 标签管理
    TAG_ADD({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.post(`/tag/add`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 编辑 - 标签管理
    TAG_UPDATE({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.put(`/tag/update`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 删除 - 标签管理
    TAG_DELETE({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.delete(`/tag/delete/${data}`)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
    // 批量删除 - 标签管理
    TAG_DELBATCH({ commit }, data) {
        return new Promise((resolve, reject) => {
            Axios.delete(`/tag/batchDelete`, data)
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject();
              commit('errorMsg');
            })
        })
    },
}