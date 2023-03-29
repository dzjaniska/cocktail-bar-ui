<template>
    <v-container class="text-center d-flex flex-column container" v-if="user.id || user.id === ''">
        <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"/>
        <v-form v-if="!loading">
            <v-row class="d-flex justify-center mb-4">
                <v-col cols="2" class="d-flex justify-start">
                    <router-link style="text-decoration: none" :to="'/admin/users'" v-if="!isUser">
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
                <v-col cols="12" md="6" class="mb-4" v-if="isUser">
                    <v-select
                            v-if="user.id"
                            v-model="lang"
                            :items="['en','ru']"
                            :label="$t('users.language')"
                            outlined
                            required>
                    </v-select>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field outlined
                                  v-model="user.title"
                                  :label="$t('users.name')"
                                  :rules="[rules.required]"
                                  required/>
                </v-col>
                <v-col cols="12" md="6" v-if="!isUser">
                    <v-select
                            v-if="user.id"
                            v-model="user.role"
                            :items="items"
                            :label="$t('users.role')"
                            outlined
                            required>
                    </v-select>
                </v-col>
                <v-col cols="12" md="6" v-if="!isUser">
                    <v-text-field
                            outlined
                            v-model="user.login"
                            :label="$t('users.login')"
                            required/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                            type="password"
                            outlined
                            v-model="user.password"
                            :label="$t('users.password')"
                            required/>
                </v-col>
            </v-row>
            <v-row class="d-flex justify-center flex-column">
                <v-divider/>
                <v-btn color="green" class="ma-4" @click="submit">
                    <v-icon>
                        {{"mdi-check"}}
                    </v-icon>
                    {{user.id ? $t('users.userUpdate') : $t('users.userCreate')}}
                </v-btn>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {ROLES} from "../../../store/modules/user";

    export default {
        name: "UserDetails",
        computed: {
            ...mapGetters(["current", "user", "language"]),
            isUser: {
                get: function () {
                    return this.current && this.current.role === ROLES.USER
                }
            }
        },
        data() {
            return {
                items: Object.values(ROLES),
                loading: false,
                lang: undefined,
                rules: {
                    required: value => !!value || this.$t("form.required")
                }
            }
        },
        methods: {
            ...mapActions(["getUserById", "updateUser", "saveUser"]),
            ...mapMutations(["setTarget", "setLanguage"]),
            async submit() {
                this.loading = true;
                if (this.user.id) {
                    await this.updateUser(this.user);
                } else {
                    await this.saveUser(this.user);
                }
                this.loading = false;
            },
        },
        async mounted() {
            this.loading = true;
            if (this.current && this.current.role === ROLES.USER) {
                this.lang = this.language;
                this.setTarget(this.current);
            } else {
                const id = this.$route.params.id;
                if (id) {
                    await this.getUserById(id);
                } else {
                    this.setTarget({
                        id: ""
                    });
                }
            }
            this.loading = false;
        },
        watch: {
            lang(l) {
                if (!!l && l !== this.language) {
                    this.setLanguage(l);
                    location.reload();
                }
            }
        },
        beforeDestroy() {
            this.setTarget({});
        }
    }
</script>

<style scoped lang="scss">
    .container {
        height: 100%;
    }
</style>