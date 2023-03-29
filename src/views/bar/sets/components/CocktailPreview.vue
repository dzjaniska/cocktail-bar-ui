<template>
    <v-dialog v-bind:value="open"
              persistent
              max-width="600"
              overlay-opacity="0.8">
        <v-card class="pa-4" v-if="cocktail && cocktail.id">
            <v-card-text>
                <h2 class="text-center">{{ name }}</h2>
                <h3 class="text-center" v-if="iSBarmen && order.id">
                    {{ $t('message.user') }}: {{ order.user.title}}
                </h3>
                <img alt="img" class="image d-block mx-auto my-6" :src="cocktail.image || placeholderImg"/>
                <v-col cols="12" class="d-flex flex-wrap justify-center">
                    <v-chip class="text--lighten-3 amber--text ma-1" v-for="tag in tagLabels" v-bind:key="tag">
                        {{ tag }}
                    </v-chip>
                </v-col>
                <v-col cols="12" class="d-flex justify-center mx-auto">
                    <p class="text-justify">{{ description }}</p>
                </v-col>
                <v-row v-for="(item) in cocktail.cocktailIngredients" :key="item.id">
                    <v-col cols="12" class="d-flex justify-center mx-auto py-0">
                        <v-col cols="8" class="text-start  py-0">
                            {{ ingredientName(item.ingredientDTO.name) }}
                        </v-col>
                        <v-col cols="4" md="2" class="d-flex align-center py-0">
                            {{ item.quantity }}
                            {{ item.ingredientDTO.unit }}
                        </v-col>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-col cols="12"
                       class="justify-space-between d-flex mx-auto">
                    <v-btn @click="createOrder" color="success" v-if="isUser && !hasActiveOrder">
                        {{ $t('orders.order') }}
                    </v-btn>
                    <v-btn @click="changeOrder(ORDER_STATUS.CANCELLED)" color="error" v-if="isUser && isActiveOrder">
                        {{ $t('orders.cancel') }}
                    </v-btn>
                    <v-btn @click="changeOrder(ORDER_STATUS.PROCESSING)" color="success"
                           v-if="iSBarmen && isActiveOrder">
                        {{ $t('orders.start') }}
                    </v-btn>
                    <v-btn @click="changeOrder(ORDER_STATUS.DONE)" color="success darken-2"
                           v-if="iSBarmen && isProcessingOrder">
                        {{ $t('orders.finish') }}
                    </v-btn>
                    <v-btn class="ml-auto" @click="onClose">
                        {{ $t('message.close') }}
                    </v-btn>
                </v-col>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import placeholderImg from "../../../../assets/placeholder-image.jpg";
    import {label} from "../../../../utils/labelUtils";
    import {ROLES} from "../../../../store/modules/user";
    import router from "../../../../router/router";
    import {defaultPagination, ORDER_STATUS} from "../../../../store/modules/orders";

    export default {
        name: "CocktailPreview",
        props: {
            open: Boolean,
            onClose: Function
        },
        data() {
            return {
                ORDER_STATUS,
                placeholderImg
            }
        },
        computed: {
            ...mapGetters(["activeSet", "current", "cocktail", "order", "orders"]),
            name: {
                get: function () {
                    return label(this?.cocktail?.name);
                }
            },
            description: {
                get: function () {
                    return label(this?.cocktail?.description);
                }
            },
            isUser: {
                get: function () {
                    return this.current.role === ROLES.USER;
                }
            },
            iSBarmen: {
                get: function () {
                    return this.current.role === ROLES.BARMEN;
                }
            },
            hasActiveOrder: {
                get: function () {
                    return this.orders.content.some(o => o.status === ORDER_STATUS.CREATED || o.status === ORDER_STATUS.PROCESSING);
                }
            },
            isActiveOrder: {
                get: function () {
                    return this.order.status === ORDER_STATUS.CREATED;
                }
            },
            isProcessingOrder: {
                get: function () {
                    return this.order.status === ORDER_STATUS.PROCESSING;
                }
            },
            tagLabels: {
                get: function () {
                    return this.cocktail.tags?.map(tag => label(tag.label));
                }
            }
        },
        methods: {
            ...mapActions(["saveOrder", "updateOrder", "getOrders"]),
            async createOrder() {
                await this.saveOrder({cocktailId: this.cocktail.id, setId: this.activeSet.id});
                this.onClose();
                if (this.$route.path === "/set/orders") {
                    await this.getOrders({id: this.activeSet.id, params: {...defaultPagination}});
                    return;
                }
                router.push("/set/orders");
            },
            async changeOrder(status) {
                if (this.order && this.order.id) {
                    await this.updateOrder({...this.order, status});
                    await this.getOrders({id: this.order.set.id, params: {...defaultPagination}});
                    if (this.current.role === ROLES.USER || (this.current.role === ROLES.BARMEN && status !== ORDER_STATUS.PROCESSING)) {
                        this.onClose();
                    }
                }
            },
            ingredientName(labels) {
                return label(labels);
            },
        }
    }
</script>

<style scoped>
    .image {
        max-height: 240px;
        max-width: 240px;
    }
</style>