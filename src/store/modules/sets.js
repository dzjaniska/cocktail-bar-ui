import {getRequest, postRequest, putRequest} from "../../utils/requestUtils";

const state = {
    activeSet: {},
    set: {},
    sets: {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    }
};

const getters = {
    activeSet: state => state.activeSet,
    set: state => state.set,
    sets: state => state.sets
};

const actions = {
    async getSets({commit}, params) {
        const response = await getRequest({path: "/sets", data: params, catchRequest: true});
        if (response) {
            commit("setSets", response.data);
        }
        return response;
    },
    async getActiveSet({commit}) {
        let response = await getRequest({
            path: "/sets",
            data: {page: 0, size: 1, status: SET_STATUS.ACTIVE},
            catchRequest: true
        });

        if (response?.data?.content?.length !== 1) {
            return response;
        }

        response = await getRequest({path: `/sets/${response.data.content[0].id}`, catchRequest: true});
        if (response) {
            commit("setActiveSet", response.data);
        }

        return response;
    },
    async getSetById({commit}, id) {
        const response = await getRequest({path: `/sets/${id}`, catchRequest: true});
        if (response) {
            commit("setSet", response.data);
        }
        return response;
    },
    async getTargetSetById(bag, id) {
        return await getRequest({path: `/sets/${id}`, catchRequest: true});
    },
    async saveSet({commit}, data) {
        const response = await postRequest({path: "/sets", data, catchRequest: true});
        if (response) {
            commit("setSet", response.data);
        }
        return response;
    },
    async updateSet({commit}, data) {
        const response = await putRequest({path: `/sets/${data.id}`, data, catchRequest: true});
        if (response) {
            commit("setSet", response.data);
        }
        return response;
    },
    async joinSet({commit}, id) {
        const response = await postRequest({
            path: `/sets/${id}/join`,
            data: {password: ""},
            catchRequest: true
        });
        if (response) {
            commit("setActiveSet", response.data);
        }
        return response;
    },
};

const mutations = {
    setSet: (state, set) => state.set = set,
    setSets: (state, sets) => (state.sets = sets),
    setActiveSet: (state, set) => (state.activeSet = set || null),
    addCocktail: (state, {cocktail, isActive}) => {
        const target = isActive ? state.activeSet : state.set;
        if (target.cocktails.some(c => c.id === cocktail.id)) {
            return;
        }
        const cocktails = [...target.cocktails, cocktail];
        const set = {...target, cocktails};
        if (isActive) {
            state.activeSet = {...set};
        } else {
            state.set = {...set};
        }
    },
    deleteInnerCocktail: (state, {index, isActive}) => {
        if (isActive) {
            state.activeSet = {
                ...state.activeSet,
                cocktails: [...state.activeSet.cocktails.filter((i, ind) => ind !== index)]
            }
        } else {
            state.set = {
                ...state.set,
                cocktails: [...state.set.cocktails.filter((i, ind) => ind !== index)]
            }
        }
    }
};

export default {
    state, getters, actions, mutations
}

export const defaultPagination = {
    page: 0,
    size: 10
}

export const SET_STATUS = {
    OPENED: "OPENED",
    ACTIVE: "ACTIVE",
    CLOSED: "CLOSED"
}