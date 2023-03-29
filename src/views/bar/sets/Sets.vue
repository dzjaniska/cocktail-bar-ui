<template>
    <v-container class="text-center d-flex flex-column container">
        <v-row class="page-title align-center mb-4" style="flex: none">
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <h2>{{$t("message.sets")}}</h2>
            </v-col>
            <v-col cols="2">
                <router-link style="text-decoration: none" :to="`admin/create/sets`"
                             v-if="isBarmen">
                    <h4 class="hidden-xs-only">{{ $t('sets.setCreate') }}</h4>
                    <v-icon>
                        {{ "mdi-plus-circle-multiple"}}
                    </v-icon>
                </router-link>
            </v-col>
        </v-row>
        <v-data-table
                @click:row="open"
                hide-default-header
                :headers="headers"
                :items="sets.content"
                disable-items-per-page
                hide-default-footer
                :item-class="row_classes"
                mobile-breakpoint="0">
            <template v-slot:item.date="{ item }">
                {{ $t("sets." + item.status) }}
            </template>
            <template v-slot:item.status="{ item }">
                {{ formatDate(item.date) }}
            </template>
        </v-data-table>
        <Pagination class="mt-auto"
                    v-bind:on-change="change"
                    v-bind:page="sets.page"
                    v-bind:total-pages="sets.totalPages"/>
    </v-container>
</template>

<script>
    import Pagination from "../../../components/pagination/Pagination";
    import {mapActions, mapGetters} from "vuex";
    import {defaultPagination, ROLES} from "../../../store/modules/user";
    import router from "../../../router/router";
    import {SET_STATUS} from "../../../store/modules/sets";
    import moment from "moment";

    export default {
        name: "Sets",
        components: {Pagination},
        computed: {
            ...mapGetters(["sets", "current"]),
            isBarmen: {
                get: function () {
                    return this.current && this.current.role === ROLES.BARMEN
                }
            }
        },
        data() {
            return {
                roles: ROLES,
                loading: false,
                headers: [
                    {value: 'date'},
                    {value: 'owner.title'},
                    {value: 'status'}
                ],
            }
        },
        methods: {
            ...mapActions(["getSets"]),
            async change(page) {
                this.loading = true;
                await this.getSets({...defaultPagination, page});
                this.loading = false;
            },
            open(items, current) {
                router.push(`sets/${current.item.id}`)
            },
            row_classes(item) {
                if (SET_STATUS.ACTIVE === item.status) {
                    return "text--lighten-3 amber--text";
                }

                if (SET_STATUS.CLOSED === item.status) {
                    return "grey--text";
                }
            },
            formatDate(date) {
                return moment(date).format("DD.MM.yyyy");
            },
        },
        async mounted() {
            this.loading = true;
            await this.getSets();
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

        h4.hidden-xs-only {
            color: #b71c1c;
        }


    }
</style>