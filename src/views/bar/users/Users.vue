<template>
    <v-container class="text-center d-flex flex-column container">
        <v-row class="page-title align-center mb-4" style="flex: none">
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <h2>{{$t("message.users")}}</h2>
            </v-col>
            <v-col cols="2">
                <router-link style="text-decoration: none" :to="`create/users`">
                    <h4 class="hidden-xs-only">{{ $t('users.userCreate') }}</h4>
                    <v-icon>
                        {{ "mdi-plus-circle-multiple"}}
                    </v-icon>
                </router-link>
            </v-col>
        </v-row>
        <v-data-table
                hide-default-header
                :headers="headers"
                :items="users.content"
                disable-items-per-page
                hide-default-footer
                mobile-breakpoint="0">
            <template v-slot:item.id="{ item }">
                <router-link :to="`users/${item.id}`">
                    <v-icon>
                        {{ "mdi-pencil"}}
                    </v-icon>
                </router-link>
            </template>
        </v-data-table>
        <Pagination class="mt-auto"
                    v-bind:on-change="change"
                    v-bind:page="users.page"
                    v-bind:total-pages="users.totalPages"/>
    </v-container>
</template>

<script>
    import Pagination from "../../../components/pagination/Pagination";
    import {mapActions, mapGetters} from "vuex";
    import {defaultPagination} from "../../../store/modules/user";

    export default {
        name: "Users",
        components: {Pagination},
        computed: mapGetters(["users"]),
        data() {
            return {
                loading: false,
                headers: [
                    {value: 'title'},
                    {value: 'role'},
                    {value: 'id', align: 'end'}
                ],
            }
        },
        methods: {
            ...mapActions(["getUsers"]),
            async change(page) {
                this.loading = true;
                await this.getUsers({...defaultPagination, page});
                this.loading = false;
            }
        },
        async mounted() {
            this.loading = true;
            await this.getUsers({...defaultPagination});
            this.loading = false;
        }
    }
</script>

<style scoped lang="scss">
    .container {
        height: 100%;

        h4.hidden-xs-only {
            color: #b71c1c;
        }
    }
</style>