<template>
    <v-container class="text-center d-flex flex-column container" v-if="activeSet && activeSet.id">
        <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"/>
        <v-container class="pa-0 ma-0">
            <v-row class="d-flex justify-center">
                <v-col cols="12">
                    <v-text-field v-model="filter" :label="$t('message.cocktailSearch')"/>
                </v-col>
            </v-row>
            <SetCocktailItem v-for="(cocktail, index) in cocktails"
                             :key="cocktail.id" :cocktail="cocktail" :index="index"/>
            <v-row class="d-flex justify-center" v-if="isBarmen">
                <v-col cols="12">
                    <CocktailSearch :is-active="true"/>
                </v-col>
            </v-row>
            <v-row class="d-flex actions" v-if="isBarmen">
                <v-col cols="12">
                    <v-btn color="green" @click="submit">
                        <v-icon>
                            {{"mdi-check"}}
                        </v-icon>
                        {{ $t('sets.setUpdate') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import {SET_STATUS} from "../../../store/modules/sets";
    import CocktailSearch from "./components/CocktailSearch";
    import {ROLES} from "../../../store/modules/user";
    import SetCocktailItem from "./components/SetCocktailItem";
    import {labelString} from "../../../utils/labelUtils";

    export default {
        name: "SetCocktails",
        components: {CocktailSearch, SetCocktailItem},
        computed: {
            ...mapGetters(["activeSet", "current", "cocktail"]),
            isOpened: {
                get: function () {
                    return this.activeSet?.status === SET_STATUS.OPENED;
                }
            },
            isBarmen: {
                get: function () {
                    return this.current.role === ROLES.BARMEN;
                }
            },
            cocktails: {
                get: function () {
                    const search = new RegExp(`.*${this.filter}.*`, "i");
                    return this.activeSet.cocktails.filter(c => search.test(c.name[labelString()]));
                }
            }
        },
        data() {
            return {
                loading: false,
                filter: ""
            }
        },
        methods: {
            ...mapActions(["updateSet"]),
            async submit() {
                this.loading = true;
                if (this.activeSet.id) {
                    await this.updateSet(this.activeSet);
                }
                this.loading = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    .actions .v-btn.v-size--default {
        font-size: 11px;
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
        .actions.v-btn.v-size--default {
            font-size: 14px;
        }
    }
</style>