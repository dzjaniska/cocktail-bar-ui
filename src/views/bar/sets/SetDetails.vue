<template>
    <v-container class="text-center d-flex flex-column container " :class="loading?'align-center justify-center':''"
                 v-if="set.id || set.id===''">
        <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"/>
        <v-form v-if="!loading">
            <v-row class="d-flex justify-space-between align-center mb-4">
                <v-col cols="4" class="d-flex justify-start">
                    <router-link style="text-decoration: none" :to="'/sets'">
                        <v-btn>
                            <v-icon>
                                {{ "mdi-arrow-left-bold"}}
                            </v-icon>
                            {{ $t('message.back') }}
                        </v-btn>
                    </router-link>
                </v-col>
                <v-col cols="4" class="d-flex justify-center">
                    <h3>{{ $t('message.general') }}</h3>
                </v-col>
                <v-col cols="4" class="d-flex justify-end">
                    <v-btn v-if="isActive && !isUser"
                           color="secondary"
                           @click="open = true">
                        {{ $t('sets.invitationLink') }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="mb-4 px-4 text-start align-center d-flex" justify="center" v-if="set.status">
                <v-col cols="6" md="4">
                    {{ $t('message.status') }}
                </v-col>
                <v-col cols="6" md="4" class="justify-space-between d-flex align-center">
                    {{ $t('sets.' + set.status) }}
                </v-col>
                <v-dialog v-bind:value="open"
                          persistent
                          max-width="480"
                          overlay-opacity="0.8">
                    <v-card class="pa-4">
                        <v-card-text class="d-flex justify-center">
                            <img class="qr-image" :src="qrImage" alt="qr"/>
                        </v-card-text>
                        <v-card-actions class="d-flex justify-space-between">
                            <v-btn @click="copy">
                                {{ $t('sets.copyLink') }}
                            </v-btn>
                            <v-btn @click="open = false">
                                {{ $t('message.close') }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-row justify="center" v-if="!isActive && !isClosed">
                <v-col cols="12" md="6">
                    <v-menu
                            ref="menu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                    outlined
                                    v-model="set.date"
                                    :label="$t('sets.date')"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                                :readonly="isActive || isClosed"
                                :min="new Date().toISOString().substr(0, 10)"
                                :max="!isActive && !isClosed ? '2099-12-31' : set.date"
                                v-model="set.date"
                                no-title
                                scrollable/>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row class="mb-4 px-4 text-start align-center d-flex" justify="center" v-if="isActive || isClosed">
                <v-col cols="6" md="4">
                    {{ $t('sets.date') }}
                </v-col>
                <v-col cols="6" md="4" class="justify-space-between d-flex align-center">
                    {{ formatDate(set.date) }}
                </v-col>
            </v-row>
            <v-row class="mb-4 px-4 text-start align-center d-flex" justify="center" v-if="isActive || isClosed">
                <v-col cols="6" md="4">
                    {{ $t('message.bartender') }}
                </v-col>
                <v-col cols="6" md="4" class="justify-space-between d-flex align-center">
                    {{ set.owner.title }}
                </v-col>
            </v-row>
            <div v-if="isBarmen && set.id ">
                <v-row class="d-flex justify-center align-center mt-12">
                    <v-col cols="3"/>
                    <v-col cols="6" md="4" class="d-flex justify-center">
                        <h3>{{ $t('message.cocktails') }}</h3>
                    </v-col>
                    <v-col cols="3">
                        <SetPreview  v-if="isOpened || isActive"/>
                    </v-col>
                </v-row>
                <v-row class="d-flex justify-center align-center" v-for="(cocktail, index) in set.cocktails"
                       :key="cocktail.id">
                    <v-col cols="2" class="text-start">
                        <img class="image" :src="cocktail.image" alt="img"/>
                    </v-col>
                    <v-col cols="6" md="4" class="text-start">
                        {{ getCocktailName(cocktail) }}
                    </v-col>
                    <v-col cols="4" md="2">
                        <v-btn color="red lighten-2" @click="deleteInnerCocktail({index, isActive: false})"
                               v-if="isBarmen && (isOpened || isActive)">
                            <v-icon>
                                {{ "mdi-delete"}}
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
            <v-row class="d-flex justify-center" v-if="(isOpened || isActive) && isBarmen">
                <v-col cols="12" md="8">
                    <CocktailSearch :is-active="false"/>
                </v-col>
            </v-row>
            <v-row class="d-flex justify-space-between align-center mt-12" v-if="set.id && (isActive || isClosed)">
                <v-col cols="12" class="d-flex justify-center">
                    <h3>{{ $t('message.users') }}</h3>
                </v-col>
            </v-row>
            <v-row class="d-flex justify-center align-center mb-4">
                <v-col cols="12" md="8" class="d-flex justify-start align-center" v-for="user in set.users"
                       v-bind:key="user.id">
                    <v-icon class="mr-4">{{ "mdi-account" }}</v-icon>
                    {{ user.title }}
                </v-col>
            </v-row>
            <v-row class="d-flex justify-space-between align-center mt-12" v-if="set.id && (isActive || isClosed)">
                <v-col cols="12" class="d-flex justify-center">
                    <h3>{{ $t('sets.setOrders') }}</h3>
                </v-col>
            </v-row>
            <v-row :class="'d-flex justify-center align-center cocktail-item ' + [order.status === ORDER_STATUS.CANCELLED && ' secondary--text '] + [order.status === ORDER_STATUS.DONE && ' success--text ']"
                   v-for="(order) in orders.content" :key="order.id">
                <v-col cols="12" md="8" class="d-flex align-start">
                    <v-col cols="2" class="text-start">
                        <img class="image" :src="order.cocktail.image" alt="img"/>
                    </v-col>
                    <v-col cols="4" class="text-start">
                        <div class="d-flex flex-column">
                            <span>{{ getCocktailName(order.cocktail) }}</span>
                            <span v-if="isBarmen">
                                <v-icon class="mr-2">{{ "mdi-account" }}</v-icon>
                                {{ order.user.title }}
                            </span>
                        </div>
                    </v-col>
                    <v-col cols="3" class="text-start">
                        {{ $t('orders.' + order.status) }}
                    </v-col>
                    <v-col cols="3" class="text-start">
                        {{ order.time }}
                    </v-col>
                </v-col>
            </v-row>
            <v-row class="d-flex justify-space-between actions" v-if="!isUser">
                <v-col cols="6">
                    <v-btn color="green" @click="submit" v-if="!isClosed">
                        <v-icon>
                            {{"mdi-check"}}
                        </v-icon>
                        {{set.id ? $t('sets.setUpdate') : $t('sets.setCreate')}}
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn color="primary" @click="changeStatus(SET_STATUS.ACTIVE)"
                           v-if="availableToStart && (!activeSet || !activeSet.id)">
                        <v-icon>
                            {{"mdi-play"}}
                        </v-icon>
                        {{ $t('sets.setStart') }}
                    </v-btn>
                    <v-btn color="primary" @click="changeStatus(SET_STATUS.CLOSED)" v-if="isActive">
                        <v-icon>
                            {{"mdi-stop"}}
                        </v-icon>
                        {{ $t('sets.setClose') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {labelString} from "../../../utils/labelUtils";
    import {SET_STATUS} from "../../../store/modules/sets";
    import moment from "moment";
    import {ROLES} from "../../../store/modules/user";
    import CocktailSearch from "./components/CocktailSearch";
    import router from "../../../router/router";
    import {defaultPagination, ORDER_STATUS} from "../../../store/modules/orders";
    import SetPreview from "./components/SetPreview";

    export default {
        name: "SetDetails",
        components: {CocktailSearch, SetPreview},
        computed: {
            ...mapGetters(["set", "activeSet", "language", "current", "orders"]),
            isOpened: {
                get: function () {
                    return this.set?.status === SET_STATUS.OPENED;
                }
            },
            isActive: {
                get: function () {
                    return this.set?.status === SET_STATUS.ACTIVE;
                }
            },
            isClosed: {
                get: function () {
                    return this.set?.status === SET_STATUS.CLOSED;
                }
            },
            isBarmen: {
                get: function () {
                    return this.current.role === ROLES.BARMEN;
                }
            },
            isUser: {
                get: function () {
                    return this.current.role === ROLES.USER;
                }
            },
            availableToStart: {
                get: function () {
                    return moment().startOf("day").isSame(moment(this.set?.date)) && this.isOpened;
                }
            },
            inviteLink: {
                get: function () {
                    return `${location.origin}/sets/${this.$route.params.id}/join`;
                }
            },
            qrImage: {
                get: function () {
                    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(this.inviteLink)}`;
                }
            }
        },
        data() {
            return {
                ROLES,
                ORDER_STATUS,
                SET_STATUS,
                loading: false,
                open: false
            }
        },
        methods: {
            ...mapActions(["getSetById", "updateSet", "saveSet", "getActiveSet", "getOrders"]),
            ...mapMutations(["setSet", "setActiveSet", "deleteInnerCocktail", "setOrders"]),
            async submit() {
                this.loading = true;
                if (this.set.id) {
                    await this.updateSet(this.set);
                } else {
                    const response = await this.saveSet(this.set);
                    if (response.status === 200) {
                        router.push(`/sets/${response.data.id}`)
                    }
                }
                this.loading = false;
            },
            async changeStatus(status) {
                this.loading = true;
                await this.updateSet({...this.set, status});
                this.loading = false;
                if (status === SET_STATUS.ACTIVE) {
                    this.getActiveSet();
                }
                if (status === SET_STATUS.CLOSED) {
                    this.setActiveSet({});
                    router.push("/sets");
                }
            },
            getCocktailName(cocktail) {
                return cocktail.name[labelString()];
            },
            copy() {
                navigator.clipboard.writeText(this.inviteLink);
            },
            formatDate(date) {
                return moment(date).format("DD.MM.yyyy");
            },
        },
        async mounted() {
            this.loading = true;
            const id = this.$route.params.id;
            if (id) {
                await this.getSetById(id);
                await this.getOrders({id, params: {...defaultPagination}});
            } else {
                this.setSet({
                    id: ""
                });
            }
            this.loading = false;
        },
        beforeDestroy() {
            this.setSet({});
            this.setOrders([]);
        }
    }
</script>

<style scoped lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    .container {
        .actions .v-btn.v-size--default {
            font-size: 11px;
        }

        img.qr-image {
            width: 100%;
        }

        .image {
            max-height: 48px;
            max-width: 48px;
        }

        .rounded-circle {
            min-width: 36px;
        }

        @media #{map-get($display-breakpoints, 'sm-and-up')} {
            .image {
                max-height: 96px;
                max-width: 96px;
            }

            .actions.v-btn.v-size--default {
                font-size: 14px;
            }
        }
    }
</style>