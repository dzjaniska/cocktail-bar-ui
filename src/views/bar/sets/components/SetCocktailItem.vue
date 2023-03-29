<template>
    <v-row class="align-center cocktail-item">
        <v-col cols="2" class="text-start" @click="openPreview(cocktail.id)">
            <img class="image" :src="cocktail.image" alt="img"/>
        </v-col>
        <v-col :cols="isBarmen ? 6 : 10" class="text-start" @click="openPreview(cocktail.id)">
            {{ getCocktailName(cocktail) }}
        </v-col>
        <v-col cols="4" md="2" v-if="isBarmen">
            <v-btn color="red lighten-2" @click="deleteInnerCocktail({index, isActive:true})">
                <v-icon>
                    {{ "mdi-delete"}}
                </v-icon>
            </v-btn>
        </v-col>
        <CocktailPreview :open="open" :onClose="onClose"/>
    </v-row>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {labelString} from "../../../../utils/labelUtils";
    import {ROLES} from "../../../../store/modules/user";
    import CocktailPreview from "./CocktailPreview";

    export default {
        name: "SetCocktailItem",
        components: {CocktailPreview},
        data() {
            return {
                open: false
            }
        },
        props: {
            cocktail: Object,
            index: Number
        },
        computed: {
            ...mapGetters(["current"]),
            isBarmen: {
                get: function () {
                    return this.current.role === ROLES.BARMEN;
                }
            }
        },
        methods: {
            ...mapActions(["getCocktailById"]),
            ...mapMutations(["deleteInnerCocktail", "setCocktail", "setOrder"]),
            getCocktailName(cocktail) {
                return cocktail.name[labelString()];
            },
            async openPreview(id) {
                this.open = true;
                await this.getCocktailById(id);
            },
            onClose() {
                this.open = false;
                this.setCocktail({});
                this.setOrder({});
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    img.qr-image {
        width: 100%;
    }

    .image {
        max-height: 48px;
        max-width: 48px;
    }

    .cocktail-item {
        cursor: pointer;
        min-height: 80px;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.7);
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
        .image {
            max-height: 96px;
            max-width: 96px;
        }
    }
</style>