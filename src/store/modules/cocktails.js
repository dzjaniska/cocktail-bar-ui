import {deleteRequest, getRequest, postRequest, putRequest} from "../../utils/requestUtils";

const state = {
    cocktail: {},
    cocktails: {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    }
};

const getters = {
    cocktail: state => state.cocktail,
    cocktails: state => state.cocktails
};

const apiActions = {
    async deleteCocktail({commit}, data) {
        const id = data.id;
        const response = await deleteRequest({path: `/cocktails/${id}`, catchRequest: true});
        if (response) {
            commit("deleteCocktail", id);
        }
        return response;
    },
    async getCocktails({commit}, params) {
        const response = await getRequest({path: "/cocktails", data: params, catchRequest: true});
        if (response) {
            commit("setCocktails", response.data);
        }
        return response.data;
    },
    async getCocktailById({commit}, id) {
        const response = await getRequest({path: `/cocktails/${id}`, catchRequest: true});
        if (response) {
            commit("setCocktail", response.data);
        }
        return response;
    },
    async saveCocktail({commit}, data) {
        const response = await postRequest({path: "/cocktails", data, catchRequest: true});
        if (response) {
            commit("setCocktail", response.data);
        }
        return response;
    },
    async updateCocktail({commit}, data) {
        const response = await putRequest({
            path: `/cocktails`,
            data: {
                ...data, cocktailIngredients: data.cocktailIngredients.map(i => {
                    i.id = null;
                    return i;
                })
            },
            catchRequest: true
        });
        if (response) {
            commit("setCocktail", response.data);
        }
        return response;
    }
};

const appActions = {
    addIngredient({commit}, ingredient) {
        commit("addIngredient", ingredient);
    },
    deleteInnerIngredient({commit}, index) {
        commit("deleteInnerIngredient", index);
    },

};

const mutations = {
    deleteCocktail: (state, id) => (state.ingredients = {
        ...state.cocktails,
        content: state.cocktails.content.filter(i => i.id !== id)
    }),
    setCocktails: (state, cocktails) => (state.cocktails = cocktails),
    setCocktail: (state, cocktail) => (state.cocktail = cocktail),
    addIngredient: (state, ingredientDTO) => {
        if (state.cocktail.cocktailIngredients.some(ingr => ingr.ingredientDTO.id === ingredientDTO.id)) {
            return;
        }
        const cocktailIngredients = [...state.cocktail.cocktailIngredients, {
            ingredientDTO,
            id: null,
            cocktailDTO: null,
            quantity: 0
        }];
        const cocktail = {
            ...state.cocktail,
            cocktailIngredients: cocktailIngredients
        }
        state.cocktail = {...cocktail}
    },
    deleteInnerIngredient: (state, index) => {
        state.cocktail = {
            ...state.cocktail,
            cocktailIngredients: [...state.cocktail.cocktailIngredients.filter((i, ind) => ind !== index)]
        }
    },
};

export default {
    state, getters, actions: {...apiActions, ...appActions}, mutations
}

export const defaultPagination = {
    page: 0,
    size: 10
}