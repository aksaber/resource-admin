import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: '',
        tagsList: [],
        activePath: '', // 当前路由
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setPath(state, name) {
            state.activePath = name;
        },
        setLocalTagsList(state, data) {
            state.tagsList = data;
        },
        selectTags(state, data) {
            let result = false;
            for (let i = 0; i < state.tagsList.length; i++) {
                if (state.tagsList[i].to == data.to) {
                    return result = true;
                }
            }
            if (!result) {
                state.tagsList.push(data);
                localStorage.setItem('tagsList', JSON.stringify(state.tagsList));
            }
        },
        closeTag(state, data) {
            let result = state.tagsList.findIndex(item => item.to === data.to);
            state.tagsList.splice(result, 1);
            localStorage.setItem('tagsList', JSON.stringify(state.tagsList));
        },
        errorMsg(state, text) {
            alert(text ? text : '服务异常，请稍后再试')
        },
    },
    actions,
    // getters,
    // modules: {}
})