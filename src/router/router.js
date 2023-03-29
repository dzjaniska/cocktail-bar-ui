import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
import {i18n} from "../plugins/i18n";
import {ROLES} from "../store/modules/user";

Vue.use(VueRouter)

const LOGIN = {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/Login.vue"),
    meta: {
        allowAnonymous: true
    }
};

const REGISTRATION = {
    path: "/login/registration",
    name: "REGISTRATION",
    component: () => import("../views/login/Registration.vue"),
    meta: {
        allowAnonymous: true
    }
};

const PROFILE = {
    path: "/profile",
    name: i18n.messages[i18n.locale].users.profile,
    component: () => import("../views/bar/users/UserDetails.vue"),
    icon: "mdi-account",
    meta: {
        requiredRole: [ROLES.USER]
    }
};

const HOME = {
    path: "/",
    name: "Home",
    icon: "mdi-home",
    component: () => import("../views/home/Home.vue"),
};

const COCKTAILS = {
    path: "/admin/cocktails",
    name: i18n.messages[i18n.locale].message.cocktails,
    icon: "mdi-glass-cocktail",
    component: () => import("../views/bar/cocktails/Cocktails.vue"),
    meta: {
        requiredRole: [ROLES.ADMIN, ROLES.BARMEN]
    }
};

const COCKTAIL_DETAILS = {
    path: "/admin/cocktails/:id",
    name: "Cocktail details",
    component: () => import("../views/bar/cocktails/CocktailDetails.vue"),
    meta: {
        requiredRole: [ROLES.ADMIN, ROLES.BARMEN]
    }
};

const COCKTAIL_CREATE = {
    path: "/admin/create/cocktails",
    name: "Create Cocktail",
    component: () => import("../views/bar/cocktails/CocktailDetails.vue"),
    meta: {
        requiredRole: [ROLES.ADMIN, ROLES.BARMEN]
    }
};

const INGREDIENTS = {
    path: "/admin/ingredients",
    name: i18n.messages[i18n.locale].message.ingredients,
    icon: "mdi-food",
    component: () => import("../views/bar/ingredients/Ingredients.vue"),
    beforeEnter: (to, from, next) => {
        next();
    },
    meta: {
        requiredRole: [ROLES.ADMIN, ROLES.BARMEN]
    }
};

const INGREDIENT_DETAILS = {
    path: "/admin/ingredients/:id",
    name: "Ingredient details",
    component: () => import("../views/bar/ingredients/IngredientDetails.vue"),
    meta: {
        requiredRole: [ROLES.ADMIN, ROLES.BARMEN]
    }
};

const INGREDIENT_CREATE = {
    path: "/admin/create/ingredients",
    name: "Create Ingredient",
    component: () => import("../views/bar/ingredients/IngredientDetails.vue"),
    meta: {
        requiredRole: [ROLES.ADMIN, ROLES.BARMEN]
    }
};

const TAGS = {
    path: "/admin/tags",
    name: i18n.messages[i18n.locale].message.tags,
    icon: "mdi-tag",
    component: () => import("../views/bar/tags/Tags.vue"),
    meta: {
        requiredRole: [ROLES.ADMIN, ROLES.BARMEN]
    }
};

const SETS = {
    path: "/sets",
    name: i18n.messages[i18n.locale].message.sets,
    icon: "mdi-glass-mug-variant",
    component: () => import("../views/bar/sets/Sets.vue"),
    meta: {
        requiredRole: [ROLES.ADMIN, ROLES.BARMEN, ROLES.USER]
    }
};

const SET_DETAILS = {
    path: "/sets/:id",
    name: "Set details",
    component: () => import("../views/bar/sets/SetDetails"),
    meta: {
        requiredRole: [ROLES.ADMIN, ROLES.BARMEN, ROLES.USER]
    }
};

const SET_CREATE = {
    path: "/admin/create/sets",
    name: "Create set",
    component: () => import("../views/bar/sets/SetDetails"),
    meta: {
        requiredRole: [ROLES.BARMEN]
    }
};

const USERS = {
    path: "/admin/users",
    name: i18n.messages[i18n.locale].message.users,
    icon: "mdi-account-multiple",
    component: () => import("../views/bar/users/Users.vue"),
    meta: {
        requiredRole: [ROLES.ADMIN]
    }
};

const USER_DETAILS = {
    path: "/admin/users/:id",
    name: "User details",
    component: () => import("../views/bar/users/UserDetails"),
    meta: {
        requiredRole: [ROLES.ADMIN]
    }
};

const USER_CREATE = {
    path: "/admin/create/users",
    name: "Create user",
    component: () => import("../views/bar/users/UserDetails"),
    meta: {
        requiredRole: [ROLES.ADMIN]
    }
};

const SET_JOIN = {
    path: "/sets/:id/join",
    name: "Join set",
    component: () => import("../views/bar/sets/JoinSet"),
    meta: {
        requiredRole: [ROLES.USER]
    }
};

const SET_INFO = {
    path: "/set/info",
    name: i18n.messages[i18n.locale].sets.setInfo,
    icon: "mdi-information",
    component: () => import("../views/bar/sets/SetInfo"),
    meta: {
        requiredRole: [ROLES.BARMEN]
    }
};

const SET_COCKTAILS = {
    path: "/set/cocktails",
    name: i18n.messages[i18n.locale].sets.setCocktails,
    icon: "mdi-glass-cocktail",
    component: () => import("../views/bar/sets/SetCocktails"),
    meta: {
        requiredRole: [ROLES.BARMEN]
    }
};

const SET_COCKTAILS_ORDER = {
    path: "/set/cocktails/order",
    name: i18n.messages[i18n.locale].sets.setCocktailsOrder,
    icon: "mdi-glass-cocktail",
    component: () => import("../views/bar/sets/SetCocktailsOrder"),
    meta: {
        requiredRole: [ROLES.USER]
    }
};

const SET_ORDERS = {
    path: "/set/orders",
    name: i18n.messages[i18n.locale].sets.setOrders,
    icon: "mdi-order-bool-ascending",
    component: () => import("../views/bar/sets/SetOrders"),
    meta: {
        requiredRole: [ROLES.USER, ROLES.BARMEN]
    }
};

export const adminPages = [TAGS, INGREDIENTS, COCKTAILS, SETS, USERS];
export const bartenderPages = [TAGS, INGREDIENTS, COCKTAILS, SETS];
export const bartenderOnSetPages = [SET_INFO, SET_COCKTAILS, SET_ORDERS];
export const userPages = [SETS, PROFILE];
export const userOnSetPages = [SET_COCKTAILS_ORDER, SET_ORDERS, SETS, PROFILE];

export const getPages = (role, onSet) => {
    switch (role) {
        case ROLES.ADMIN:
            return adminPages;
        case ROLES.BARMEN:
            return onSet ? bartenderOnSetPages : bartenderPages;
        default:
            return onSet ? userOnSetPages : userPages;
    }
}

const routes = [HOME, LOGIN, REGISTRATION, PROFILE, COCKTAILS, INGREDIENTS, INGREDIENT_DETAILS, INGREDIENT_CREATE, SETS, SET_DETAILS, SET_CREATE, USERS, USER_DETAILS, USER_CREATE, COCKTAIL_DETAILS, COCKTAIL_CREATE, TAGS, SET_JOIN, SET_INFO, SET_COCKTAILS, SET_COCKTAILS_ORDER, SET_ORDERS];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.allowAnonymous) {
        return next();
    }
    let token = store.state.user.token;
    if (!token) {
        await store.dispatch("retrieveToken");
        if (!store.state.user.token) {
            return next({
                path: LOGIN.path,
                query: {redirect: to.fullPath}
            })
        }
    }
    if (!store.state.user.user) {
        try {
            await store.dispatch("currentUser");
        } catch (e) {
            console.debug("unauthorized")
        }
    }
    if (!store.state.user.user) {
        return next({
            path: LOGIN.path,
            query: {redirect: to.fullPath}
        })
    }
    const role = store.state.user.user?.role;
    if ((!to.meta.requiredRole || to.meta.requiredRole.includes(role))) {
        next();
    } else {
        next({
            path: LOGIN.path,
            query: {redirect: to.fullPath}
        })
    }
});

export default router;
