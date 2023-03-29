<template>
    <div>
        <v-btn class="rounded-circle pa-1" @click="open = true">
            <v-icon>
                {{ "mdi-plus"}}
            </v-icon>
        </v-btn>
        <v-dialog v-bind:value="open"
                  persistent
                  max-width="600"
                  overlay-opacity="0.8">
            <v-card class="pa-4">
                <v-card-text>
                    <h2 class="text-center">{{ $t('message.sets') }}</h2>
                    <v-progress-circular
                            class="d-flex mx-auto my-8"
                            v-if="loading"
                            indeterminate
                            color="primary"/>
                    <v-expansion-panels value="">
                        <v-expansion-panel
                                @click="value = index"
                                v-for="(set, index) in sets.content"
                                :key="set.id">
                            <v-expansion-panel-header>
                                {{ set.date }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-progress-circular
                                        class="d-flex mx-auto"
                                        v-if="fetching"
                                        indeterminate
                                        color="primary"/>
                                <template v-if="target">
                                    <div class="d-flex cocktail-item mb-4 align-center"
                                         v-for="cocktail in target.cocktails"
                                         v-bind:key="cocktail.id">
                                        <img class="image mr-8" :src="cocktail.image || placeholderImg" alt="img"/>
                                        <h4>{{ getCocktailName(cocktail) }}</h4>
                                    </div>
                                    <div class="d-flex justify-end">
                                        <v-btn color="amber" class="ml-auto" @click="addToSet(target.cocktails)">
                                            {{ $t('message.add') }}
                                        </v-btn>
                                    </div>
                                </template>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <Pagination class="mt-auto"
                                v-bind:on-change="change"
                                v-bind:page="sets.page"
                                v-bind:total-pages="sets.totalPages"/>
                </v-card-text>
                <v-card-actions>
                    <v-col cols="12"
                           class="justify-end d-flex mx-auto">
                        <v-btn class="ml-auto" @click="open = false">
                            {{ $t('message.close') }}
                        </v-btn>
                    </v-col>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import placeholderImg from "../../../../assets/placeholder-image.jpg";
    import {defaultPagination} from "../../../../store/modules/sets";
    import Pagination from "../../../../components/pagination/Pagination";
    import {label, labelString} from "../../../../utils/labelUtils";

    export default {
        name: "SetPreview",
        components: {Pagination},
        data() {
            return {
                open: false,
                loading: false,
                fetching: false,
                value: 0,
                target: undefined,
                placeholderImg
            }
        },
        computed: {
            ...mapGetters(["sets"]),
            name: {
                get: function () {
                    return label(this?.cocktail?.name);
                }
            },
        },
        methods: {
            ...mapActions(["getSets", "getTargetSetById"]),
            ...mapMutations(["addCocktail"]),
            async change(page) {
                this.loading = true;
                await this.getSets({...defaultPagination, page});
                this.loading = false;
            },
            getCocktailName(cocktail) {
                return cocktail.name[labelString()];
            },
            addToSet(cocktails) {
                cocktails.forEach(cocktail => this.addCocktail({cocktail, isActive: false}));
            }
        },
        watch: {
            async open(o) {
                if (o) {
                    this.loading = true;
                    await this.getSets({...defaultPagination});
                    this.loading = false;
                } else {
                    this.target = undefined;
                    this.value = 0;
                }
            },
            async value(val) {
                this.target = undefined;
                this.fetching = true;
                const set = this.sets.content[val];
                if (set) {
                    const response = await this.getTargetSetById(set.id);
                    if (response.status === 200) {
                        this.target = response.data;
                    }
                }
                this.fetching = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        .rounded-circle {
            min-width: 36px;
        }
    }

    .image {
        max-height: 64px;
        max-width: 64px;
    }

    .cocktail-item {
        min-height: 64px;
    }
</style>