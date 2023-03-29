import axios from "axios";
import store from "../store/index";

export const BASE_URL = `${process.env.NODE_ENV === "production" ? process.env.VUE_APP_API_SERVER : ""}`;
const API_URL = `${BASE_URL}/api`;

const getConfig = (params) => {

    const config = {
        headers: {},
        params: {...params},
        cancelToken: undefined,
        crossDomain: true
    };

    const token = store.state.user.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

export const postRequest = async ({path, data, successMessage, errorMessage, catchRequest}) => {
    const config = getConfig();
    const submit = submitRequest(axios.post(buildUrl(path), data, config), successMessage, errorMessage);
    return catchRequest ? submit.catch(defaultCatch) : submit;
};

export const postParamRequest = async ({path, params, successMessage, errorMessage, catchRequest}) => {
    const config = getConfig(params);
    const submit = submitRequest(axios.post(buildUrl(path), null, config), successMessage, errorMessage);
    return catchRequest ? submit.catch(defaultCatch) : submit;
};

export const putRequest = async ({path, data, successMessage, errorMessage, catchRequest}) => {
    const config = getConfig();
    const submit = submitRequest(axios.put(buildUrl(path), data, config), successMessage, errorMessage);
    return catchRequest ? submit.catch(defaultCatch) : submit;
};

export const getRequest = async ({path, data, successMessage, errorMessage, catchRequest}) => {
    const config = getConfig();
    config.params = {...data};
    const submit = submitRequest(axios.get(buildUrl(path), config), successMessage, errorMessage);
    return catchRequest ? submit.catch(defaultCatch) : submit;
};

export const deleteRequest = async ({path, data, successMessage, errorMessage, catchRequest}) => {
    const config = await getConfig();
    config.params = {...data};
    const submit = submitRequest(axios.delete(buildUrl(path), config), successMessage, errorMessage);
    return catchRequest ? submit.catch(defaultCatch) : submit;
};

const buildUrl = (path) => {
    if (path.indexOf("http") > -1) {
        return path;
    } else {
        return API_URL + path;
    }
}

const submitRequest = (request, successMessage, errorMessage) => {
    return request.then(response => {
        if (successMessage) {
            //TODO: implement success snackbar
        }
        return response;
    }).catch((error) => {
        store.commit("setSnackbar", error)
        if (!errorMessage) {
            //TODO: implement error snackbar
        }
        return Promise.reject(error.response);
    })
};

export const defaultCatch = (e) => {
    console.debug(e.status)
};
