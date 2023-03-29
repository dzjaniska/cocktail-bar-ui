<template>
    <transition name="fade">
        <v-container class="text-center d-flex flex-column" v-if="activeSet && activeSet.id">
            <v-row>
                <v-col cols="4">
                    <v-btn @click="changePhase">
                        <v-icon>
                            {{ "mdi-arrow-left-bold"}}
                        </v-icon>
                        {{ $t('message.return') }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="loader-wrapper flex-column">
                <p>{{ $t('orders.random') }}</p>
                <div>
                    <v-progress-circular
                            v-if="!open"
                            indeterminate
                            color="primary"/>
                </div>
            </v-row>
            <CocktailPreview :open="open" :onClose="onClose"/>
        </v-container>
    </transition>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    import CocktailPreview from "./CocktailPreview";

    export default {
        name: "RandomCocktail",
        components: {CocktailPreview},
        computed: {
            ...mapGetters(["activeSet"]),
        },
        data() {
            return {
                open: false
            }
        },
        methods: {
            ...mapMutations(["setCocktail", "setOrder"]),
            changePhase() {
                this.$emit("changePhase", 0)
            },
            onClose() {
                this.open = false;
                this.setCocktail({});
                this.setOrder({});
                setTimeout(this.selectCocktail, 500);
                setTimeout(() => this.open = true, 2000);
            },
            selectCocktail() {
                this.setCocktail(this.activeSet.cocktails[Math.floor(Math.random() * this.activeSet.cocktails.length)]);
            }
        },
        mounted() {
            this.selectCocktail();
            this.open = true;

        },
        beforeDestroy() {
            this.setCocktail({});
            this.setOrder({});
            this.open = false;
        }
    }
</script>

<style scoped lang="scss">
    .container {
        height: 100%;
    }

    .loader-wrapper {
        flex-grow: 1;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>