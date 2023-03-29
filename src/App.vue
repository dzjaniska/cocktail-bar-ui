<template>
    <v-app color="red lighten-2">
        <v-app-bar app
                   v-if="current && current.id"
                   color="primary">
            <img class="logo-img mr-auto ml-0" :src="logo" alt="logo"/>
            <span v-if="current && current.id && current.role !== ROLES.USER"
                  class="overline text-center mr-6 hidden-xs-only">{{current.title}} ({{ current.role }})</span>
            <v-select v-if="current && current.id && current.role !== ROLES.USER"
                      class="language-switcher mr-4" v-model="lang"
                      :items="['en','ru']"/>
            <v-icon class="hidden-sm-and-up ml-4"
                    color="black"
                    size="32"
                    @click="auth">
                {{current ? "mdi-logout-variant" :"mdi-login-variant"}}
            </v-icon>
            <v-btn color="red lighten-2"
                   class="ml-4 hidden-xs-only"
                   @click="auth"
                   dark>
                {{current ? $t('message.logout') : $t('message.login')}}
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer
                v-if="current"
                app
                :permanent="!$vuetify.breakpoint.mdAndDown">
            <v-list class="mt-16 pa-4">
                <v-switch v-if="current.role === ROLES.BARMEN && activeSet && activeSet.id"
                          v-model="onSet"
                          :label="onSet ? $t('message.menu') : $t('message.current')"
                ></v-switch>
                <router-link v-for="(item, index) in pages" :to="item.path" :key="index">
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            {{item.name}}
                        </v-list-item-title>
                    </v-list-item>
                </router-link>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <router-view/>
            <v-snackbar :value="snackbar">
                {{ snackbar }}
                <template v-slot:action="{ attrs }">
                    <v-btn color="pink"
                           text
                           v-bind="attrs"
                           @click="setSnackbar(undefined)">
                        <v-icon>{{ "mdi-close" }}</v-icon>
                    </v-btn>
                </template>
            </v-snackbar>
            <v-bottom-navigation class="hidden-lg-and-up" v-if="current && current.id" grow fixed app>
                <v-btn v-for="(item, index) in pages" :to="item.path" :key="index" style="height: inherit">
                    <span>{{item.name}}</span>
                    <v-icon>{{item.icon}}</v-icon>
                </v-btn>
                <v-btn @click="onSet= !onSet" v-if="current.role === ROLES.BARMEN && activeSet && activeSet.id"
                       style="height: inherit">
                    <span>{{ onSet ? $t('message.back') : $t('message.current') }}</span>
                    <v-icon>{{ onSet ? 'mdi-menu' : 'mdi-account-box' }}</v-icon>
                </v-btn>
            </v-bottom-navigation>
        </v-main>
    </v-app>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import router, {getPages} from "./router/router";
    import {ROLES} from "./store/modules/user";
    import {defaultPagination} from "./store/modules/orders";
    import logo from "./assets/cocktail.png";

    export default {
        name: "App",
        computed: mapGetters(["current", "language", "activeSet", "activeSet", "snackbar"]),
        data() {
            return {
                ROLES,
                logo,
                onSet: false,
                pages: [],
                open: false,
                lang: undefined
            }
        },
        methods: {
            ...mapMutations(["setLanguage", "setActiveSet", "setSnackbar"]),
            ...mapActions(["logout", "getTags", "getActiveSet", "getOrders"]),
            auth() {
                router.push("/login");
                if (this.current) {
                    this.logout();
                    this.pages = [];
                }
            },
        },
        watch: {
            lang(l) {
                if (!!l && l !== this.language) {
                    this.setLanguage(l);
                    this.onSet = false;
                    location.reload();
                }
            },
            async current(user) {
                if (user) {
                    this.lang = this.language;
                    this.getTags();
                    if (user.role === ROLES.USER || user.role === ROLES.BARMEN) {
                        const response = await this.getActiveSet();
                        if (response.status === 200) {
                            const active = response?.data;
                            this.onSet = !!active?.id;
                            this.pages = getPages(this.current.role, this.onSet);
                            if (active && active?.id) {
                                this.getOrders({id: active.id, params: {...defaultPagination}});
                            }
                            return;
                        }
                    }
                    this.pages = getPages(user.role, false);
                }
            },
            onSet(value) {
                this.pages = getPages(this.current.role, value);
            }
        }
    }
</script>

<style lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    html {
        background-color: white !important;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-y: auto !important;
    }


    header.v-app-bar {
        left: 0 !important;
        z-index: 7 !important;

        .v-toolbar__content {
            display: flex;
            justify-content: flex-end;
        }

        .logo-img {
            max-height: 40px;
            max-width: 40px;
        }
    }

    .v-navigation-drawer__content {
        & .v-input__slot .v-input--selection-controls__input {
            margin-right: 32px;
        }

        & a {
            color: #ffffff;
            text-decoration: none;

            &.router-link-exact-active {
                .v-list-item__title, .v-icon {
                    color: #ffd382
                }
            }
        }
    }

    .language-switcher {
        flex-basis: 48px;
        max-width: 72px !important;

        &.v-input.v-text-field.v-select {
            padding-top: 20px;

            .v-input__slot {

                &:before {
                    border: none;
                }
            }
        }

        .v-select__selection--comma {
            margin: 7px 4px 7px 20px;
        }
    }

    .v-bottom-navigation .v-btn {
        height: 100%;
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
        .logo-img {
            max-height: 48px;
            max-width: 48px;
        }
    }
</style>
