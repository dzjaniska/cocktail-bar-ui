<template>
    <v-container :class="[loading ? 'align-center justify-center' : ''] + ' text-center d-flex flex-column container'"
                 v-if="activeSet && activeSet.id">
        <v-row class="d-flex justify-space-between align-center">
            <v-col cols="4"/>
            <v-col cols="4" class="d-flex justify-center">
                <h2>{{ $t('sets.setOrders') }}</h2>
            </v-col>
            <v-col cols="4"/>
        </v-row>
        <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"/>
        <div v-if="!loading">
            <v-row :class="'d-flex justify-center align-center cocktail-item ' + [order.status === ORDER_STATUS.CANCELLED && ' secondary--text '] + [order.status === ORDER_STATUS.PROCESSING && ' text--lighten-3 amber--text '] + [order.status === ORDER_STATUS.DONE && ' success--text ']"
                   v-for="(order) in orders.content"
                   :key="order.id" @click="openOrder(order)">
                <v-col cols="2" class="text-start">
                    <img class="image" :src="order.cocktail.image" alt="img"/>
                </v-col>
                <v-col cols="4" class="text-start">
                    <div class="d-flex flex-column">
                        <span>{{ getCocktailName(order.cocktail) }}</span>
                        <span v-if="current.role === ROLES.BARMEN" class="d-flex">
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
            </v-row>
        </div>
        <CocktailPreview :open="open" :onClose="onClose"/>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {defaultPagination, ORDER_STATUS} from "../../../store/modules/orders";
    import {labelString} from "../../../utils/labelUtils";
    import CocktailPreview from "./components/CocktailPreview";
    import {ROLES} from "../../../store/modules/user";

    export default {
        name: "SetOrders",
        components: {CocktailPreview},
        computed: mapGetters(["activeSet", "orders", "current"]),
        data() {
            return {
                ORDER_STATUS,
                ROLES,
                loading: false,
                open: false,
                update: undefined
            }
        },
        methods: {
            ...mapActions(["getOrders"]),
            ...mapMutations(["setOrder", "setCocktail"]),
            getCocktailName(cocktail) {
                return cocktail.name[labelString()];
            },
            openOrder(order) {
                if (order.status !== ORDER_STATUS.CANCELLED) {
                    this.open = true;
                    this.setOrder(order)
                    this.setCocktail(order.cocktail)
                }
            },
            onClose() {
                this.open = false;
                this.setCocktail({});
                this.setOrder({});
            },
            async loadOrders(id) {
                this.loading = true;
                await this.getOrders({id, params: {...defaultPagination}});
                if (this.current.role === ROLES.BARMEN) {
                    this.update = setInterval(() => {
                        this.getOrders({id, params: {...defaultPagination}})
                    }, 30000);
                }
                this.loading = false;
            }
        },
        async mounted() {
            if (this.activeSet && this.activeSet.id) {
                await this.loadOrders(this.activeSet.id);
            }
        },
        beforeDestroy() {
            clearInterval(this.update);
        }
    }
</script>

<style scoped lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    .v-container {
        height: 100%;
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
    }

    .v-btn.rounded-circle {
        min-width: 36px;
        padding: 0;
    }

    .image {
        max-height: 48px;
        max-width: 48px;
    }

    .cocktail-item {
        cursor: pointer;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.7);
        min-height: 80px;
    }

    .disabled-item {
        color: gray;
    }

    .done-item {
        color: $color-pack;
    }
</style>