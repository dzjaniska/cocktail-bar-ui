import Vue from "vue"
import VueI18n from "vue-i18n"
import {uiLang} from "../store/modules/user";

Vue.use(VueI18n);

const messages = {
    en: {
        message: {
            welcome: "Welcome",
            ingredients: "Ingredients",
            cocktails: "Cocktails",
            sets: "Sets",
            users: "Users",
            user: "User",
            titleRu: "Name Russian",
            titleEn: "Name English",
            descriptionRu: "Description Russian",
            descriptionEn: "Description English",
            tags: "Tags",
            general: "General info",
            back: "Back",
            return: "Back",
            alc: "Alcohol",
            unit: "Unit",
            status: "Status",
            close: "Close",
            current: "To current",
            menu: "To menu",
            bartender: "Bartender",
            history: "History",
            cocktailSearch: "Type for search",
            activeOrder: "You already have an active order. When it will be done you can make another order. Meanwhile you can check the list of available cocktails.",
            login: "Log in",
            logout: "Log out",
            registration: "Registration",
            submit: "Submit",
            yes: "Yes",
            no: "No",
            add: "Add",
        },
        cocktail: {
            unit: "Unit",
            quantity: "Quantity",
            addIngredient: "Add an ingredient",
            cocktailCreate: "Create cocktail",
            cocktailUpdate: "Update cocktail",
        },
        ingredient: {
            ingredientCreate: "Create ingredient",
            ingredientUpdate: "Update ingredient",
        },
        tags: {
            tagCreate: "Create tag",
        },
        sets: {
            setCreate: "Create set",
            setUpdate: "Update set",
            date: "Set start date",
            addCocktail: "Add cocktail",
            setStart: "Start set",
            setClose: "Close set",
            invitationLink: "Invite",
            copyLink: "Copy link",
            setInfo: "Info",
            setCocktails: "Catalog",
            setCocktailsOrder: "Make order",
            setOrders: "Orders",
            hello: "Hello",
            joining: "Joining the set, please wait",
            OPENED: "OPENED",
            ACTIVE: "ACTIVE",
            CLOSED: "CLOSED"
        },
        users: {
            userCreate: "Create user",
            userUpdate: "Update user",
            name: "Display name",
            login: "Login",
            password: "Password",
            role: "Role",
            profile: "Profile",
            language: "UI Language"
        },
        orders: {
            order: "Order",
            cancel: "Cancel order",
            start: "Start",
            finish: "Finish",
            CREATED: "Created",
            PROCESSING: "Processing",
            DONE: "Done",
            CANCELLED: "Cancelled",
            random: "Looking for a nice cocktail for you. Press Back to cancel the search",
            hero: "Congratulations warrior! We are glad you made so far. Proceed at your own risk. Good luck!",

            phaseOne_order_0: "Choose from catalog",
            phaseTwo_order_0: "Choose by tag",
            phaseThree_order_0: "Choose random cocktail",

            phaseOne_order_1: "I know what I want",
            phaseTwo_order_1: "I roughly know what I want",
            phaseThree_order_1: "I don't care what I want",

            phaseOne_order_2: "I definitely know what I want",
            phaseTwo_order_2: "I think I know what I want but I'm not sure",
            phaseThree_order_2: "I still don't care what I want",

            phaseOne_order_3: "I want the best cocktail ever!",
            phaseTwo_order_3: "Maybe a sour?",
            phaseThree_order_3: "C'mon, let's do this!",

            phaseOne_order_4: "I want what I want",
            phaseTwo_order_4: "One more, please?",
            phaseThree_order_4: "I don't give a shit!",

            phaseOne_order_5: "I want it all. I want it all. I want it now!",
            phaseTwo_order_5: "Gimme! Gimme! Gimme! A Man After Midnight",
            phaseThree_order_5: "Give it to me baby! Uh huh uh huh",

            phaseOne_order_6: "I'm okay! One more!",
            phaseTwo_order_6: "I'm okay? One more?",
            phaseThree_order_6: "Just make me a drink mthfckr",

            phaseOne_order_7: "cL%#HIK iGu@cp2d yYF%$2 z#M1&DA",
            phaseTwo_order_7: "s HLl@__2rwlgY$ Phi%$231nT Es^4f",
            phaseThree_order_7: "5GR( 12@56 xDCtL be231wx O4###ME^h23Q ZsA",
        },
        form: {
            required: "Required"
        },
        label: {
            deleteWarning: "Are you sure you want to delete this item?"
        }
    },
    ru: {
        message: {
            welcome: "Добро пожаловать",
            ingredients: "Ингредиенты",
            cocktails: "Коктейли",
            sets: "Сессии",
            users: "Пользователи",
            user: "Пользователь",
            titleRu: "Название рус.",
            titleEn: "Название англ.",
            descriptionRu: "Описание рус.",
            descriptionEn: "Описание  англ.",
            tags: "Тэги",
            general: "Описание",
            back: "В меню",
            return: "Назад",
            alc: "Содержание алкоголя",
            unit: "Единица измерения",
            status: "Статус",
            close: "Закрыть",
            current: "К текущей",
            menu: "В меню",
            bartender: "Бармен",
            history: "История",
            cocktailSearch: "Введите название для поиска",
            activeOrder: "Вы уже сделали заказ. Повторный заказ будет доступен после завершения текущего.",
            login: "Вход",
            logout: "Выход",
            registration: "Регистрация",
            submit: "Подтвердить",
            yes: "Да",
            no: "Нет",
            add: "Добавить",
        },
        cocktail: {
            unit: "Единица",
            quantity: "Количество",
            addIngredient: "Добавить ингредиент",
            cocktailCreate: "Создать коктейль",
            cocktailUpdate: "Обновить коктейль",
        },
        ingredient: {
            ingredientCreate: "Создать ингредиент",
            ingredientUpdate: "Обновить ингредиент",
        },
        tags: {
            tagCreate: "Создать тэг",
        },
        users: {
            userCreate: "Создать пользователя",
            userUpdate: "Обновить пользователя",
            name: "Имя",
            login: "Login",
            password: "Пароль",
            role: "Роль",
            profile: "Профиль",
            language: "Язык приложения"
        },
        sets: {
            setCreate: "Создать сессию",
            setUpdate: "Обновить сессию",
            date: "Дата начала сессии",
            addCocktail: "Добавить коктейль",
            setStart: "Начать сессию",
            setClose: "Закончить сессию",
            invitationLink: "Пригласить",
            copyLink: "Скопировать ссылку",
            setInfo: "Информация",
            setCocktails: "Каталог",
            setCocktailsOrder: "Заказать",
            setOrders: "Заказы",
            hello: "Здравствуйте",
            joining: "Подключаюсь к сессии. Пожалуйста, подождите",
            OPENED: "ОТКРЫТ",
            ACTIVE: "АКТИВНЫЙ",
            CLOSED: "ЗАКРЫТ"
        },
        orders: {
            order: "Заказать",
            cancel: "Отменить",
            start: "Готовить",
            finish: "Завершить",
            CREATED: "Создан",
            PROCESSING: "Готовится",
            DONE: "Сделан",
            CANCELLED: "Отменен",
            random: "Поиск коктейля. Нажмите Назад, чтобы отметить поиск ",
            hero: "Поздравляем, Воин. Мы рады приветствовать тебя у врат Вальхаллы. Коли ты силён духом и печенью, можешь продолжить путешествие в мир алкоголизма. Удачи!",

            phaseOne_order_0: "Выбор из каталога",
            phaseTwo_order_0: "Выбор по категории",
            phaseThree_order_0: "Выбор случайного коктейля",

            phaseOne_order_1: "Я знаю, что хочу",
            phaseTwo_order_1: "Я примерно знаю, что хочу",
            phaseThree_order_1: "Мне все равно, что пить",

            phaseOne_order_2: "Я точно знаю, что хочу",
            phaseTwo_order_2: "Я знаю, что хочу, но это не точно",
            phaseThree_order_2: "Все еще не знаю, что хочется мне",

            phaseOne_order_3: "Я хочу пить то, что хочу пить",
            phaseTwo_order_3: "Ну, я точно хочу, но точно не знаю",
            phaseThree_order_3: "Еще по одной",

            phaseOne_order_4: "Мне вот этот красненький",
            phaseTwo_order_4: "Мне вот этот сладенький",
            phaseThree_order_4: "Слышь, сладенький, наливай давай, чего ждешь?",

            phaseOne_order_5: "Нужно боооольше коктейлей!",
            phaseTwo_order_5: "Таааак, чего бы заказать?",
            phaseThree_order_5: "Да вообще по барабану, замути там чего",

            phaseOne_order_6: "Мне уже хорошо! Но можно лучше!",
            phaseTwo_order_6: "Мне уже хорошо? Но можно лучше?",
            phaseThree_order_6: "ПИИИИИИИИИИТЬ!!!!11!Ё",

            phaseOne_order_7: "cL%#HIK iGu@cp2d yYF%$2 z#M1&DA",
            phaseTwo_order_7: "s HLl@__2rwlgY$ Phi%$231nT Es^4f",
            phaseThree_order_7: "5GR( 12@56 xDCtL be231wx O4###ME^h23Q ZsA",
        },
        form: {
            required: "Обязательное поле"
        },
        label: {
            deleteWarning: "Вы уверены, что хотите удалить?"
        }
    }
}

export const i18n = new VueI18n({
    locale: localStorage.getItem(uiLang) || "ru",
    fallbackLocale: "ru",
    messages
})