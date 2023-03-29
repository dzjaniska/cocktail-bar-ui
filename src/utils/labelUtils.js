import store from "../store";

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

export const label = (labels) => {
    const language = store.state.user.language;
    return labels[`label${capitalizeFirstLetter(language)}`];
}

export const labelString = () => {
    const language = store.state.user.language;
    return `label${capitalizeFirstLetter(language)}`;
}
