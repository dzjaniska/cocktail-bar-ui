<template>
    <v-container class="text-center d-flex flex-column container " :class="loading?'align-center justify-center':''"
                 v-if="cocktail.id || cocktail.id===''">
        <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"/>
        <v-form v-if="!loading">
            <v-row class="d-flex justify-center mb-4">
                <v-col cols="2" class="d-flex justify-start">
                    <router-link style="text-decoration: none" :to="'/admin/cocktails'">
                        <v-btn>
                            <v-icon>
                                {{ "mdi-arrow-left-bold"}}
                            </v-icon>
                            {{ $t('message.back') }}
                        </v-btn>
                    </router-link>
                </v-col>
                <v-col cols="8" class="d-flex justify-center">
                    <h3>{{ $t('message.general') }}</h3>
                </v-col>
                <v-col cols="2">
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-tooltip bottom v-model="showImage">
                        <template v-slot:activator="{ on, attrs }">
                            <v-img @click="handleImageSrc"
                                   v-bind="attrs"
                                   class="image"
                                   v-bind:src="cocktail.image || placeholderImg"/>
                        </template>
                        <v-text-field outlined
                                      v-model="cocktail.image"
                                      :label="$t('message.titleEn')"
                                      required/>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-select return-object
                              v-model="cocktail.tags"
                              :items="tags"
                              :item-text="getLabel()"
                              item-value="id"
                              chips
                              label="Tags"
                              multiple/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field outlined
                                  v-model="cocktail.name.labelEn"
                                  :label="$t('message.titleEn')"
                                  :rules="[rules.required]"
                                  required/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                            outlined
                            v-model="cocktail.name.labelRu"
                            :label="$t('message.titleRu')"
                            required/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-textarea auto-grow
                                outlined
                                v-model="cocktail.description.labelEn"
                                :label="$t('message.descriptionEn')"/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-textarea auto-grow
                                outlined
                                v-model="cocktail.description.labelRu"
                                :label="$t('message.descriptionRu')"/>
                </v-col>
            </v-row>
            <v-row class="d-flex justify-center mb-4">
                <h3>{{$t('message.ingredients')}}</h3>
            </v-row>
            <v-row>
                <draggable class="ingredient-row" v-model="cocktail.cocktailIngredients" group="people"
                           @start="drag=true"
                           @end="drag=false">
                    <v-col cols="12" v-for="(item, index) in cocktail.cocktailIngredients" :key="item.id">
                        <CocktailIngredient :ingredient="item" :index="index"/>
                    </v-col>
                </draggable>
            </v-row>
            <v-row class="d-flex justify-center">
                <v-col cols="12">
                    <v-autocomplete
                            v-model="select"
                            :loading="fetching"
                            :items="items"
                            :search-input.sync="search"
                            class="mt-4"
                            flat
                            :label="$t('cocktail.addIngredient')"
                            :item-text="getIngredientLabel()"
                            return-object
                            solo-inverted/>
                </v-col>
            </v-row>
            <v-row class="d-flex justify-center flex-column">
                <v-btn color="green" class="ma-4" @click="submit">
                    <v-icon>
                        {{"mdi-check"}}
                    </v-icon>
                    {{cocktail.id ? $t('cocktail.cocktailUpdate'): $t('cocktail.cocktailCreate')}}
                </v-btn>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {labelString} from '../../../utils/labelUtils';
    import CocktailIngredient from "./CocktailIngredient";
    import placeholderImg from "../../../assets/placeholder-image.jpg";
    import draggable from "vuedraggable";
    import router from "../../../router/router";

    export default {
        name: "CocktailDetails",
        components: {CocktailIngredient, draggable},
        computed: mapGetters(["cocktail", "tags", "language"]),
        data() {
            return {
                loading: false,
                fetching: false,
                search: null,
                rules: {
                    required: value => !!value || this.$t("form.required")
                },
                showImage: false,
                items: [],
                select: null,
                placeholderImg
            }
        },
        methods: {
            ...mapActions(["getCocktailById", "addIngredient", "deleteInnerIngredient", "updateCocktail", "saveCocktail", "getIngredients"]),
            ...mapMutations(["setCocktail"]),
            getLabel() {
                return `label.${labelString()}`;
            },
            getIngredientLabel() {
                return `name.${labelString()}`;
            },
            async submit() {
                this.loading = true;
                if (this.cocktail.id) {
                    await this.updateCocktail(this.cocktail);
                } else {
                    const response = await this.saveCocktail(this.cocktail);
                    if (response.status === 200) {
                        router.push(`/admin/cocktails/${response.data.id}`);
                    }
                }
                this.loading = false;
            },
            handleImageSrc() {
                this.showImage = !this.showImage;
            },
            querySelections(name) {
                clearTimeout(this._timerId)
                this._timerId = setTimeout(async () => {
                    this.fetching = true;
                    this.items = JSON.parse(JSON.stringify(await this.getIngredients({lang: this.language, name})));
                    this.fetching = false;
                }, 500)
            }
        },
        async mounted() {
            this.loading = true;
            const id = this.$route.params.id;
            if (id) {
                await this.getCocktailById(id);
            } else {
                this.setCocktail({
                    id: "",
                    name: {id: null, labelEn: "", labelRu: ""},
                    description: {id: null, labelEn: "", labelRu: ""},
                    cocktailIngredients: []
                });
            }
            this.loading = false;
        },
        beforeDestroy() {
            this.setCocktail({});
        },
        watch: {
            search(val) {
                val && val !== this.select && this.querySelections(val)
            },
            select(val) {
                this.addIngredient(val);
                this.items = [];
            },
        }
    }
</script>

<style scoped lang="scss">
    .container {
        height: 100%;

        .image {
            max-height: 300px;
            max-width: 300px;
            min-height: 300px;
            min-width: 300px;
        }

        .ingredient-row {
            width: 100%;
        }
    }

    .v-tooltip__content {
        pointer-events: initial;
        opacity: 1;
        min-width: 25%;
    }
</style>