<template>
    <v-container class="text-center col-12 col-sm-6 col-md-4 d-flex flex-column justify-center"
                 @keydown.enter="login(user)" v-if="!current || !current.id">
        <v-card>
            <v-card-title class="headline secondary justify-center">
                {{ $t('message.login') }}
            </v-card-title>
            <v-card-text>
                <v-text-field :label="$t('users.login')"
                              v-model="user.login"/>
                <v-text-field :label="$t('users.password')"
                              type="password"
                              v-model="user.password"/>
            </v-card-text>
            <v-card-actions class="d-flex flex-column justify-center">
                <v-btn color="primary"
                       class="mb-8"
                       @click="login(user)"
                       width="120">
                    {{ $t('message.login') }}
                </v-btn>
                <router-link style="text-decoration: none; color: rgba(255,255,255,0.5)" class="mb-4" :to="`login/registration`">
                    <h4>{{ $t('message.registration') }}</h4>
                </router-link>
            </v-card-actions>
        </v-card>
        <v-card class="mt-4">
            <v-card-title class="headline secondary justify-center">
                Test credentials
            </v-card-title>

            <v-card-actions class="justify-space-between">
                <v-btn color="secondary"
                       @click="setFirst">
                    1
                </v-btn>
                <v-btn color="secondary"
                       @click="setSecond">
                    2
                </v-btn>
                <v-btn color="secondary"
                       @click="setThird">
                    3
                </v-btn>
                <v-btn color="secondary"
                       @click="setFourth">
                    4
                </v-btn>
                <v-btn color="secondary"
                       @click="setFifth">
                    5
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Login",
        computed: mapGetters(["current"]),
        data() {
            return {
                user: {
                    login: "king",
                    password: "excalibur"
                }
            }
        },
        methods: {
            ...mapActions(["login"]),
            setFirst() {
                this.user = {
                    login: "king",
                    password: "excalibur"
                }
            },
            setSecond() {
                this.user = {
                    login: "bartender",
                    password: "bartender"
                }
            },
            setThird() {
                this.user = {
                    login: "user",
                    password: "user"
                }
            },
            setFourth() {
                this.user = {
                    login: "tester",
                    password: "tester"
                }
            },
            setFifth() {
                this.user = {
                    login: "ololo",
                    password: "ololo"
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    .container {
        height: 100%;
    }
</style>