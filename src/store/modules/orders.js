import {getRequest, postRequest, putRequest} from "../../utils/requestUtils";

const state = {
    order: {},
    orders: {
        content: [],
        page: 0,
        size: 1000,
        totalElements: 0,
        totalPages: 0
    }
};

const getters = {
    order: state => state.order,
    orders: state => state.orders
};

const actions = {
    async getOrders({commit}, {id, params}) {
        const response = await getRequest({path: `/orders/${id}`, data: params, catchRequest: true});
        if (response) {
            commit("setOrders", response.data);
        }
        return response;
    },
    async getOderById({commit}, id) {
        const response = await getRequest({path: `/orders/single/${id}`, catchRequest: true});
        if (response) {
            commit("setOrder", response.data);
        }
        return response;
    },
    async saveOrder({commit}, data) {
        const response = await postRequest({path: "/orders", data, catchRequest: true});
        if (response) {
            commit("setOrder", response.data);
        }
        return response;
    },
    async updateOrder({commit}, data) {
        const response = await putRequest({path: `/orders/${data.id}`, data, catchRequest: true});
        if (response) {
            commit("setOrder", response.data);
        }
        return response;
    }
};

const mutations = {
    setOrder: (state, order) => state.order = order,
    setOrders: (state, orders) => state.orders = orders
};

export default {
    state, getters, actions, mutations
}

export const defaultPagination = {
    page: 0,
    size: 1000
}

export const ORDER_STATUS = {
    CREATED: "CREATED",
    PROCESSING: "PROCESSING",
    DONE: "DONE",
    CANCELLED: "CANCELLED"
}
