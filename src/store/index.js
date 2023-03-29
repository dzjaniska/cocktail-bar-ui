import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import ingredients from "./modules/ingredients";
import tags from "./modules/tags";
import cocktails from "./modules/cocktails";
import sets from "./modules/sets";
import orders from "./modules/orders";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        ingredients,
        tags,
        cocktails,
        sets,
        orders
    }
})