<template>
    <v-container class="text-center col-12 col-sm-6 col-md-4 d-flex flex-column justify-center"
                 @keydown.enter="login(user)" v-if="!current || !current.id">
        <v-form @submit.prevent="register()" v-model="valid" ref="form">
            <v-card>
                <v-card-title class="headline secondary justify-center">
                    {{ $t('message.registration') }}
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="user.title"
                                  :label="$t('users.name')"
                                  :rules="[rules.required]"
                                  required/>
                    <v-text-field
                            v-model="user.login"
                            :label="$t('users.login')"
                            :rules="[rules.required]"
                            required/>
                    <v-text-field
                            type="password"
                            v-model="user.password"
                            :label="$t('users.password')"
                            :rules="[rules.required]"
                            required/>
                </v-card-text>
                <v-card-actions class="d-flex flex-column justify-center">
                    <v-btn color="primary"
                           class="mb-8"
                           type="submit"
                           width="120">
                        {{ $t('message.registration') }}
                    </v-btn>
                    <router-link style="text-decoration: none; color: rgba(255,255,255,0.5)" class="mb-4"
                                 :to="`login/registration`">
                        <h4>{{ $t('message.login') }}</h4>
                    </router-link>
                </v-card-actions>
            </v-card>
        </v-form>

    </v-container>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Registration",
        computed: mapGetters(["current"]),
        data() {
            return {
                valid: true,
                user: {
                    login: "",
                    title: "",
                    password: ""
                },
                rules: {
                    required: value => !!value || this.$t("form.required")
                }
            }
        },
        methods: {
            ...mapActions(["registration"]),
            register() {
                const valid = this.$refs.form.validate();
                if (valid) {
                    this.registration(this.user);
                }
            }
        }

    }
</script>

<style scoped lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    .container {
        height: 100%;
    }
</style>