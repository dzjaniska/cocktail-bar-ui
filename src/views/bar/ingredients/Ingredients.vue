<template>
    <v-container class="text-center d-flex flex-column container">
        <v-row class="page-title align-center" style="flex: none">
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <h2>{{$t("message.ingredients")}}</h2>
            </v-col>
            <v-col cols="2">
                <router-link style="text-decoration: none" :to="`create/ingredients`">
                    <h4 class="hidden-xs-only">{{ $t('ingredient.ingredientCreate') }}</h4>
                    <v-icon>
                        {{ "mdi-plus-circle-multiple"}}
                    </v-icon>
                </router-link>
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center" style="flex: none">
            <v-col cols="12">
                <v-text-field v-model="search" :label="$t('message.cocktailSearch')"
                              append-icon="mdi-magnify"
                              v-on:keyup.enter="searchIngredients"
                              @click:append="searchIngredients"/>
            </v-col>
        </v-row>
        <v-data-table
                @click:row="open"
                hide-default-header
                loading="!!loading"
                :headers="headers"
                :items="ingredients.content"
                disable-items-per-page
                mobile-breakpoint="0"
                hide-default-footer>
        </v-data-table>
        <Pagination class="mt-auto"
                    v-bind:on-change="change"
                    v-bind:page="ingredients.page"
                    v-bind:total-pages="ingredients.totalPages"/>
    </v-container>
</template>

<script>
    import Pagination from "../../../components/pagination/Pagination";
    import {mapActions, mapGetters} from "vuex";
    import {labelString} from "../../../utils/labelUtils";
    import {defaultPagination} from "../../../store/modules/ingredients";
    import router from "../../../router/router";

    export default {
        name: "Ingredients",
        components: {Pagination},
        computed: mapGetters(["ingredients", "language"]),
        data() {
            return {
                loading: false,
                headers: [
                    {value: `name.${labelString()}`}
                ],
                search: ""
            }
        },
        methods: {
            ...mapActions(["deleteIngredient", "getIngredients"]),
            async change(page) {
                this.loading = true;
                await this.getIngredients({...defaultPagination, page, lang: this.language});
                this.loading = false;
            },
            open(items, current) {
                router.push(`ingredients/${current.item.id}`)
            },
            async searchIngredients() {
                this.loading = true;
                await this.getIngredients({...defaultPagination, name: this.search, lang: this.language});
                this.loading = false;
            }
        },
        async mounted() {
            this.loading = true;
            await this.getIngredients({...defaultPagination, lang: this.language});
            this.loading = false;
        }
    }
</script>

<style scoped lang="scss">
    .container {
        height: 100%;

        .v-data-table:hover {
            cursor: pointer;
        }
    }
</style>