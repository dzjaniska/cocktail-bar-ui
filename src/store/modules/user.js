import router from "../../router/router";
import {getRequest, postParamRequest, postRequest, putRequest} from "../../utils/requestUtils";
import jwt_decode from "jwt-decode";

export const uiLang = "ui_lang";

const state = {
    user: undefined,
    token: undefined,
    connected: false,
    language: undefined,
    target: {},
    users: {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    },
    snackbar: undefined
};

const getters = {
    current: state => state.user,
    language: state => state.language,
    users: state => state.users,
    user: state => state.target,
    snackbar: state => state.snackbar
};

const actions = {
    async registration({commit}, data) {
        const response = await postRequest({path: "/auth/registration", data});
        if (response.status === 200) {
            const authToken = response.data;
            commit("setToken", authToken);
            localStorage.setItem("authorization-token", authToken);
            const redirect = router.currentRoute.query?.redirect;
            router.push(redirect || "/");
        }
    },
    async login({commit}, params) {
        const response = await postParamRequest({path: "/auth", params});
        if (response.status === 200) {
            const authToken = response.data;
            commit("setToken", authToken);
            localStorage.setItem("authorization-token", authToken);
            const redirect = router.currentRoute.query?.redirect;
            router.push(redirect || "/");
        }
    },
    async currentUser({commit}) {
        const response = await getRequest({path: "/users/current", catchRequest: true});
        if (response) {
            const user = response?.data;
            const {id, title, role} = user;
            commit("setUser", {id, title, role});
            commit("setLanguage", localStorage.getItem(uiLang) || "en");
            return user;
        }
    },
    async logout({commit}) {
        localStorage.removeItem("authorization-token");
        commit("setToken", undefined);
        commit("setUser", undefined);
    },
    async getUsers({commit}, pagination) {
        const response = await getRequest({path: "/users", data: pagination, catchRequest: true});
        if (response) {
            commit("setUsers", response.data);
        }
        return response;
    },
    async getUserById({commit}, id) {
        const response = await getRequest({path: `/users/${id}`, catchRequest: true});
        if (response) {
            commit("setTarget", response.data);
        }
        return response;
    },
    async saveUser({commit}, data) {
        const response = await postRequest({path: "/users", data, catchRequest: true});
        if (response) {
            commit("setTarget", response.data);
        }
        return response;
    },
    async updateUser({commit}, data) {
        const response = await putRequest({path: `/users/${data.id}`, data, catchRequest: true});
        if (response) {
            commit("setTarget", response.data);
        }
        return response;
    },
    retrieveToken({commit}) {
        const authToken = localStorage.getItem("authorization-token");
        if (authToken) {
            const {exp} = jwt_decode(authToken);
            if (new Date().getTime() / 1000 < exp) {
                commit("setToken", authToken);
            }
        }
    }
};

const mutations = {
    setUser: (state, user) => state.user = user,
    setToken: (state, token) => state.token = token,
    setTarget: (state, target) => state.target = target,
    setLanguage: (state, language) => {
        localStorage.setItem(uiLang, language);
        state.language = language
    },
    setConnected: (state, connected) => state.connected = connected,
    setUsers: (state, users) => (state.users = users),
    setSnackbar: (state, snackbar) => (state.snackbar = snackbar)
};

export default {
    state, getters, actions, mutations
}

export const defaultPagination = {
    page: 0,
    size: 10
}

export const ROLES = {
    ADMIN: "ADMIN",
    BARMEN: "BARMEN",
    USER: "USER"
}