<template>
    <v-container class="text-center d-flex flex-column container " :class="loading?'align-center justify-center':''"
                 v-if="ingredient.id || ingredient.id===''">
        <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"/>
        <v-form v-if="!loading">
            <v-row class="d-flex justify-center mb-4">
                <v-col cols="2" class="d-flex justify-start">
                    <router-link style="text-decoration: none" :to="'/admin/ingredients'">
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
                <v-col cols="12" md="6">
                    <v-text-field outlined
                                  v-model="ingredient.name.labelEn"
                                  :label="$t('message.titleEn')"
                                  :rules="[rules.required]"
                                  required/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                            outlined
                            v-model="ingredient.name.labelRu"
                            :label="$t('message.titleRu')"
                            required/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-textarea auto-grow
                                outlined
                                v-model="ingredient.description.labelEn"
                                :label="$t('message.descriptionEn')"/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-textarea auto-grow
                                outlined
                                v-model="ingredient.description.labelRu"
                                :label="$t('message.descriptionRu')"/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field outlined
                                  v-model="ingredient.alc"
                                  type="number"
                                  :label="$t('message.alc')"
                                  :rules="[rules.required]"
                                  required/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field outlined
                                  v-model="ingredient.unit"
                                  :label="$t('message.unit')"
                                  :rules="[rules.required]"
                                  required/>
                </v-col>
            </v-row>
            <v-row class="d-flex justify-center flex-column">
                <v-divider/>
                <v-btn color="green" class="ma-4" @click="submit">
                    <v-icon>
                        {{"mdi-check"}}
                    </v-icon>
                    {{ingredient.id ?$t('ingredient.ingredientUpdate') : $t('ingredient.ingredientCreate')}}
                </v-btn>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import router from "../../../router/router";

    export default {
        name: "IngredientDetails",
        computed: mapGetters(["ingredient", "language"]),
        data() {
            return {
                loading: false,
                rules: {
                    required: value => !!value || this.$t("form.required")
                }
            }
        },
        methods: {
            ...mapActions(["getIngredientById", "updateIngredient", "saveIngredient"]),
            ...mapMutations(["setIngredient"]),
            async submit() {
                this.loading = true;
                if (this.ingredient.id) {
                    await this.updateIngredient(this.ingredient);
                } else {
                    const response = await this.saveIngredient(this.ingredient);
                    if (response.status === 200) {
                        router.push(`/admin/ingredients/${response.data.id}`);
                    }
                }
                this.loading = false;
            },
        },
        async mounted() {
            this.loading = true;
            const id = this.$route.params.id;
            if (id) {
                await this.getIngredientById(id);
            } else {
                this.setIngredient({
                    id: "",
                    alc: 0,
                    unit: "",
                    name: {id: null, labelEn: "", labelRu: ""},
                    description: {id: null, labelEn: "", labelRu: ""}
                });
            }
            this.loading = false;
        },
        beforeDestroy() {
            this.setIngredient({});
        }
    }
</script>

<style scoped lang="scss">
    .container {
        height: 100%;

        .image {
            max-height: 300px;
            max-width: 300px;
        }
    }

    .v-tooltip__content {
        pointer-events: initial;
        opacity: 1;
        min-width: 25%;
    }
</style>