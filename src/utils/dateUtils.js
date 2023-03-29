import moment from "moment";

export const parse = input => {
    if (!input) {
        return null;
    } else {
        const m = moment.utc(input);
        return m.isValid() ? m : null;
    }
}

export const formatDate = (input, format) => {
    if (typeof input === "string") {
        input = parse(input);
    }
    if (!input) {
        return "";
    }
    return input.utcOffset(moment().utcOffset()).format(format ?? "YYYY-MM-DD");
}


export const toDateUi = input => {
    return formatDate(input, "DD.MM.YYYY");
}

export const toDateTimeUi = input => {
    return formatDate(input, "DD.MM.YYYY HH:mm");
}

export const toTimeUi = input => {
    return formatDate(input, "HH:mm:ss");
}

