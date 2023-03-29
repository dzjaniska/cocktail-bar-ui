<template>
    <v-container class="text-center d-flex flex-column container">
        <v-row class="page-title align-center" style="flex: none">
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <h2>{{$t("message.cocktails")}}</h2>
            </v-col>
            <v-col cols="2">
                <router-link style="text-decoration: none" :to="`create/cocktails`">
                    <h4 class="hidden-xs-only">{{ $t('cocktail.cocktailCreate') }}</h4>
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
                              v-on:keyup.enter="searchCocktails"
                              @click:append="searchCocktails"/>
            </v-col>
        </v-row>
        <v-data-table
                @click:row="open"
                hide-default-header
                loading="!!loading"
                :headers="headers"
                :items="cocktails.content"
                :item-class='rowClass'
                disable-items-per-page
                hide-default-footer
                mobile-breakpoint="0">
            <template v-slot:item.image="{ item }">
                <v-img v-bind:src="item.image"/>
            </template>
        </v-data-table>
        <Pagination class="mt-auto"
                    v-bind:on-change="change"
                    v-bind:page="cocktails.page"
                    v-bind:total-pages="cocktails.totalPages"/>
    </v-container>
</template>

<script>
    import Pagination from "../../../components/pagination/Pagination";
    import {mapActions, mapGetters} from "vuex";
    import {labelString} from "../../../utils/labelUtils";
    import router from "../../../router/router";
    import {defaultPagination} from "../../../store/modules/cocktails";

    export default {
        name: "Cocktails",
        components: {Pagination},
        computed: mapGetters(["cocktails", "language"]),
        data() {
            return {
                loading: false,
                headers: [
                    {value: 'image'},
                    {value: `name.${labelString()}`}
                ],
                search: ""
            }
        },
        methods: {
            ...mapActions(["deleteIngredient", "getCocktails"]),
            async change(page) {
                this.loading = true;
                await this.getCocktails({...defaultPagination, page, lang: this.language});
                this.loading = false;
            },
            rowClass() {
                return "item-row";
            },
            open(items, current) {
                router.push(`cocktails/${current.item.id}`)
            },
            async searchCocktails() {
                this.loading = true;
                await this.getCocktails({...defaultPagination, name: this.search, lang: this.language});
                this.loading = false;
            }
        },
        async mounted() {
            this.loading = true;
            await this.getCocktails({lang: this.language, ...defaultPagination});
            this.loading = false;
        }
    }
</script>

<style scoped lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    .container {
        height: 100%;

        .v-data-table__wrapper .v-image {
            height: 48px;
            width: 48px;
        }

        .v-data-table:hover {
            cursor: pointer;
        }
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
        .container .v-data-table__wrapper .v-image {
            height: 100px;
            width: 100px;
        }
    }
</style>