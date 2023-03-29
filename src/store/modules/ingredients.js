import {deleteRequest, getRequest, postRequest, putRequest} from "../../utils/requestUtils";

const state = {
    ingredient: {},
    ingredients: {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    }
};

const getters = {
    ingredient: state => state.ingredient,
    ingredients: state => state.ingredients
};

const actions = {
    async deleteIngredient({commit}, data) {
        const id = data.id;
        const response = await deleteRequest({path: `/cards/white-card/${id}`, catchRequest: true});
        if (response) {
            commit("deleteWhiteCard", id);
        }
        return response;
    },
    async getIngredients({commit}, params) {
        const response = await getRequest({path: "/ingredients", data: params, catchRequest: true});
        if (!response) {
            return response;
        }

        commit("setIngredients", response.data);
        return response.data.content;
    },
    async getIngredientById({commit}, id) {
        const response = await getRequest({path: `/ingredients/${id}`, catchRequest: true});
        if (response) {
            commit("setIngredient", response.data);
        }
        return response;
    },
    async saveIngredient({commit}, data) {
        const response = await postRequest({path: "/ingredients", data, catchRequest: true});
        if (response) {
            commit("setIngredient", response.data);
        }
        return response;
    },
    async updateIngredient({commit}, data) {
        const response = await putRequest({path: "/ingredients", data, catchRequest: true});
        if (response) {
            commit("setIngredient", response.data);
        }
        return response;
    }
};
const mutations = {
    deleteIngredient: (state, id) => (state.ingredients = {
        ...state.ingredients,
        content: state.ingredients.content.filter(i => i.id !== id)
    }),
    setIngredients: (state, ingredients) => (state.ingredients = ingredients),
    setIngredient: (state, ingredient) => (state.ingredient = ingredient)
};

export default {
    state, getters, actions, mutations
}

export const defaultPagination = {
    page: 0,
    size: 10
}