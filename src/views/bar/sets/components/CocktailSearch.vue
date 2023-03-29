<template>
    <v-autocomplete
            v-model="select"
            :loading="fetching"
            :items="items"
            :search-input.sync="search"
            class="mt-4"
            flat
            :label="$t('sets.addCocktail')"
            :item-text="getCocktailLabel()"
            return-object
            solo-inverted/>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {labelString} from "../../../../utils/labelUtils";

    export default {
        name: "CocktailSearch",
        computed: mapGetters(["language"]),
        props: {
            isActive: Boolean
        },
        data() {
            return {
                loading: false,
                open: false,
                fetching: false,
                search: null,
                items: [],
                select: null
            }
        },
        methods: {
            ...mapActions(["getCocktails"]),
            ...mapMutations(["addCocktail"]),
            querySelections(name) {
                clearTimeout(this._timerId)
                this._timerId = setTimeout(async () => {
                    this.fetching = true;
                    const items = await this.getCocktails({lang: this.language, name});
                    if (!items) {
                        return;
                    }
                    this.items = JSON.parse(JSON.stringify(items.content));
                    this.fetching = false;
                }, 500)
            },
            getCocktailLabel() {
                return `name.${labelString()}`;
            }
        },
        watch: {
            search(val) {
                val && val !== this.select && this.querySelections(val)
            },
            select(val) {
                this.addCocktail({cocktail: val, isActive: this.isActive});
                this.items = [];
            },
        }
    }
</script>

<style scoped lang="scss">

</style>