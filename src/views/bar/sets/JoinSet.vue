<template>
    <v-container class="text-center d-flex flex-column container justify-center align-center">
        <h1>{{ $t('sets.hello') }}</h1>
        <h2>{{ $t('sets.joining') }}</h2>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import router from "../../../router/router";
    import {ROLES} from "../../../store/modules/user";

    export default {
        name: "JoinSet",
        computed: mapGetters(["activeSet", "current"]),
        data() {
            return {
                loading: false,
            }
        },
        methods: mapActions(["joinSet", "getActiveSet"]),
        async mounted() {
            if (this.activeSet && this.activeSet.id) {
                return router.push(this.current.role === ROLES.BARMEN ? "/set/info" : "/set/cocktails/order");
            }
            this.loading = true;
            const id = this.$route.params.id;
            if (id) {
                const response = await this.joinSet(id);
                if (response.status === 200) {
                    window.location.href = `${location.origin}${this.current.role === ROLES.BARMEN ? "/set/info" : "/set/cocktails/order"}`
                }
            }
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