import {deleteRequest, getRequest, postRequest, putRequest} from "../../utils/requestUtils";

const state = {
    tags: []
};

const getters = {
    tags: state => state.tags
};

const actions = {
    async getTags({commit}) {
        const response = await getRequest({path: "/tags", catchRequest: true});
        if (response) {
            commit("setTags", response.data);
        }
        return response;
    },
    async createTag(bag, data) {
        const response = await postRequest({path: "/tags", data, catchRequest: true});
        return response?.data;
    },
    async updateTag(bag, data) {
        const response = await putRequest({path: "/tags", data, catchRequest: true});
        return response?.data;
    },
    async deleteTag(bag, id) {
        const response = await deleteRequest({path: `/tags/${id}`, catchRequest: true});
        return response?.data;
    }
};

const mutations = {
    setTags: (state, tags) => (state.tags = tags),
};

export default {
    state, getters, actions, mutations
}