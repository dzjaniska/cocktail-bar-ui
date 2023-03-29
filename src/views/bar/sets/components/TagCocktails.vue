<template>
    <v-container class="text-center d-flex flex-column pa-0 ma-0" v-if="activeSet && activeSet.id">
        <transition name="fade">
            <div class="d-flex flex-column container" v-if="!tag">
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
                <div class="d-flex flex-column tag-item my-4" v-for="tag in catalog"
                     v-bind:key="tag.id">
                    <v-btn @click="selectTag(tag)" color="secondary" class="text--lighten-3 amber--text">
                        {{ tag.label }}
                    </v-btn>
                </div>
            </div>
            <div class="d-flex flex-column container height-auto" v-if="tag && tag.id">
                <v-row class="d-flex justify-space-between align-center mb-4">
                    <v-col cols="4">
                        <v-btn @click="selectTag(undefined)">
                            <v-icon>
                                {{ "mdi-arrow-left-bold"}}
                            </v-icon>
                            {{ $t('message.return') }}
                        </v-btn>
                    </v-col>
                    <v-col cols="4" class="d-flex justify-center">
                        <h3>{{ tag.label }}</h3>
                    </v-col>
                    <v-col cols="4" class="d-flex justify-end">
                    </v-col>
                </v-row>
                <SetCocktailItem v-for="(cocktail, index) in tag.cocktails"
                                 :key="cocktail.id" :cocktail="cocktail" :index="index"/>
            </div>
        </transition>
    </v-container>
</template>

<script>
    import {mapGetters} from "vuex";
    import {label} from "../../../../utils/labelUtils";
    import SetCocktailItem from "./SetCocktailItem";

    export default {
        name: "TagCocktails",
        components: {SetCocktailItem},
        computed: {
            ...mapGetters(["activeSet", "language"]),
            catalog: {
                get: function () {
                    if (!this.activeSet) {
                        return {};
                    }
                    const reduce = this.activeSet.cocktails.reduce((acc, cocktail) => {
                        const tags = cocktail.tags;
                        if (!tags || tags.length === 0) {
                            return acc;
                        }
                        tags.forEach(tag => {
                            acc[tag.id] = {
                                id: tag.id,
                                label: label(tag.label),
                                cocktails: (acc[tag.id]?.cocktails || []).concat([cocktail])
                            }
                        })
                        return acc;
                    }, {});

                    return Object.entries(reduce)
                        .sort(() => Math.random() - 0.5)
                        .reduce((acc, [key, value]) => {
                            acc[key] = value;
                            return acc;
                        }, {});
                }
            },
        },
        props: {
            isActive: Boolean
        },
        data() {
            return {
                tag: undefined
            }
        },
        methods: {
            selectTag(tag) {
                this.tag = {};
                setTimeout(() => this.tag = tag, 500)
            },
            changePhase() {
                this.$emit("changePhase", 0)
            }
        },
        created() {
            history.pushState(null, null, null);
            window.onpopstate = () => {
                history.pushState(null, null, null);
                if (!this.tag) {
                    return this.$emit("changePhase", 0)
                }
                this.selectTag(undefined);
            };
        }
    }
</script>

<style scoped lang="scss">
    .container, .selection-menu {
        height: 100%;
        overflow: auto;

        & > .v-btn {
            height: 50%;
        }
    }

    .height-auto.container {
        height: auto !important;
    }

    .tag-item .v-btn {
        min-height: 88px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>