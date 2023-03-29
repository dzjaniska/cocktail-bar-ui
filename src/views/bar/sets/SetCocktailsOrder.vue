<template>
    <v-container class="text-center d-flex flex-column" v-if="activeSet && activeSet.id">
        <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"/>
        <transition name="fade">
            <div class="d-flex flex-column justify-space-around selection-menu container"
                 v-if="phase === 0 && !haveActiveOrder">
                <h4 class="text-justify" v-if="completeOrders === 8"> {{ $t('orders.hero') }}</h4>
                <v-btn @click="changePhase(1)" color="secondary"
                       class="text--lighten-3 amber--text d-block text-wrap no-uppercase">
                    {{ $t(labelPhaseOne) }}
                </v-btn>
                <v-btn @click="changePhase(2)" color="secondary"
                       class="text--lighten-3 amber--text d-block text-wrap no-uppercase">
                    {{ $t(labelPhaseTwo) }}
                </v-btn>
                <v-btn @click="changePhase(3)" color="secondary"
                       class="text--lighten-3 amber--text d-block text-wrap no-uppercase">
                    {{ $t(labelPhaseThree) }}
                </v-btn>
            </div>
            <div v-if="phase === 1 || haveActiveOrder">
                <div class="d-flex ma-3">
                    <v-btn @click="changePhase(0)" v-if="!haveActiveOrder">
                        <v-icon>
                            {{ "mdi-arrow-left-bold"}}
                        </v-icon>
                        {{ $t('message.return') }}
                    </v-btn>
                    <p v-if="haveActiveOrder">{{ $t('message.activeOrder') }}</p>
                </div>
                <SetCocktails/>
            </div>
            <div v-if="phase === 2">
                <TagCocktails @changePhase="changePhase"/>
            </div>
            <div v-if="phase === 3" class="random-menu">
                <RandomCocktail @changePhase="changePhase"/>
            </div>
        </transition>
        <CocktailPreview :open="open" :onClose="onClose"/>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {labelString} from "../../../utils/labelUtils";
    import CocktailPreview from "./components/CocktailPreview";
    import SetCocktails from "./SetCocktails";
    import {ORDER_STATUS} from "../../../store/modules/orders";
    import TagCocktails from "./components/TagCocktails";
    import RandomCocktail from "./components/RandomCocktail";

    export default {
        name: "SetCocktailsOrder",
        components: {RandomCocktail, CocktailPreview, SetCocktails, TagCocktails},
        computed: {
            ...mapGetters(["activeSet", "orders"]),
            haveActiveOrder: {
                get: function () {
                    return this.orders?.content?.some(order => order.status === ORDER_STATUS.PROCESSING || order.status === ORDER_STATUS.CREATED);
                }
            },
            completeOrders: {
                get: function () {
                    return this.orders?.content?.filter(order => order.status === ORDER_STATUS.DONE).length;
                }
            },
            labelPhaseOne: {
                get: function () {
                    return `orders.phaseOne_order_${this.completeOrders <= 7 ? this.completeOrders : 0}`
                }
            },
            labelPhaseTwo: {
                get: function () {
                    return `orders.phaseTwo_order_${this.completeOrders <= 7 ? this.completeOrders : 0}`
                }
            },
            labelPhaseThree: {
                get: function () {
                    return `orders.phaseThree_order_${this.completeOrders <= 7 ? this.completeOrders : 0}`
                }
            }
        },
        data() {
            return {
                loading: false,
                open: false,
                phase: undefined
            }
        },
        methods: {
            ...mapActions(["updateSet", "getCocktailById"]),
            ...mapMutations(["deleteInnerCocktail", "setCocktail"]),
            getCocktailName(cocktail) {
                return cocktail.name[labelString()];
            },
            async openPreview(id) {
                this.open = true;
                await this.getCocktailById(id);
            },
            onClose() {
                this.open = false;
                this.setCocktail({});
            },
            changePhase(index) {
                this.phase = undefined;
                setTimeout(() => this.phase = index, 500)
            },
            addListener() {
                history.pushState(null, null, null);
                window.onpopstate = () => {
                    history.pushState(null, null, null);
                    this.changePhase(0);
                };
            }
        },
        mounted() {
            this.changePhase(0);
        },
        watch: {
            phase(p) {
                if (p !== 2) {
                    this.addListener();
                }
            }
        },
        created() {
            this.addListener();
        }
    }
</script>

<style scoped lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    .container, .selection-menu, .random-menu {
        height: 100%;

        & > .v-btn {
            flex-basis: 20%;

            &.no-uppercase {
                text-transform: unset !important;
                font-size: 16px;
            }
        }
    }

    .cocktail-item {
        cursor: pointer;
        min-height: 80px;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.7);
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

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>