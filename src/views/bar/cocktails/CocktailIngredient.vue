<template>
    <v-row v-if="ingredient.ingredientDTO" class="align-center">
        <v-col cols="4" md="8" class="text-start">
            {{ name }}
        </v-col>
        <v-col cols="4" md="2" class="d-flex align-center">
            <v-text-field
                    class="mr-2"
                    v-model="ingredient.quantity"/>
            {{ ingredient.ingredientDTO.unit }}
        </v-col>
        <v-col cols="4" md="2">
            <v-btn color="red lighten-2" @click="deleteInnerIngredient(index)">
                <v-icon>
                    {{ "mdi-delete"}}
                </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import {label} from "../../../utils/labelUtils";

    export default {
        name: "CocktailIngredient",
        data() {
            return {
                loading: false,
                rules: {
                    required: value => !!value || this.$t("form.required")
                }
            }
        },
        methods: mapActions(["deleteInnerIngredient"]),
        computed: {
            ...mapGetters(["language"]),
            name: {
                get: function () {
                    return label(this?.ingredient?.ingredientDTO?.name);
                }
            },
            description: {
                get: function () {
                    return label(this?.ingredient?.ingredientDTO?.description);
                }
            }
        },
        props: {
            ingredient: {
                id: String,
                quantity: Number,
                ingredientDTO: {
                    id: String,
                    alc: Number,
                    name: {
                        labelEn: String,
                        labelRu: String,
                    },
                    description: {
                        labelEn: String,
                        labelRu: String,
                    },
                    unit: String
                }
            },
            index: Number
        }
    }
</script>

<style scoped lang="scss">
    .row {
        cursor: pointer;
        border-bottom: 1px dashed #383838;
    }
</style>