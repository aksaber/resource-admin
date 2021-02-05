import axios from 'axios';
// axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
if (process.env.NODE_ENV === 'development') {
    // axios.defaults.baseURL = 'http://20181022Mock.com';
    axios.defaults.baseURL = '/apis';
} else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = `${window.location.origin}`;
}
axios.defaults.timeout = 60000;


//添加请求拦截器(請求回來前)
axios.interceptors.request.use(config => {
    return config;
}, error => {
//   store.commit('hideLoading');
});
// axios response 拦截器 (请求回来后)
axios.interceptors.response.use(response => {
    return response;
}, error => {
//   store.commit('hideLoading');
});

export default axios;