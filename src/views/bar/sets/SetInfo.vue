<template>
    <v-container class="text-center d-flex flex-column container " :class="loading?'align-center justify-center':''"
                 v-if="activeSet && activeSet.id">
        <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"/>
        <v-row class="d-flex justify-center align-center mb-4">
            <v-col cols="12" class="d-flex justify-center">
                <h3>{{ $t('message.general') }}</h3>
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center align-center mb-4">
            <v-col cols="4">
                <v-btn v-if="isActive"
                       color="secondary"
                       @click="open = true">
                    {{ $t('sets.invitationLink') }}
                </v-btn>
            </v-col>
        </v-row>
        <v-row class="mb-4 px-4 text-start align-center justify-center d-flex" justify="center"
               v-if="activeSet.status">
            <v-col cols="6" md="4" align="center">
                {{ $t('message.status') }}
            </v-col>
            <v-col cols="6" md="4" align="center">
                {{ $t('sets.' + activeSet.status) }}
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center align-center mb-4">
            <v-col cols="12" class="d-flex justify-center">
                <h3>{{ $t('message.users') }}</h3>
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center align-center mb-4 flex-column">
            <v-col cols="8" md="5" class="d-flex" v-for="user in activeSet.users" v-bind:key="user.id">
                <v-icon class="mr-4">{{ "mdi-account" }}</v-icon>
                {{ user.title }}
            </v-col>
        </v-row>
        <v-row class="d-flex justify-space-between actions">
            <v-col cols="12">
                <v-btn color="primary" @click="changeStatus(SET_STATUS.CLOSED)" v-if="isActive">
                    <v-icon>
                        {{"mdi-stop"}}
                    </v-icon>
                    {{ $t('sets.setClose') }}
                </v-btn>
            </v-col>
        </v-row>
        <v-dialog v-bind:value="open"
                  persistent
                  max-width="480"
                  overlay-opacity="0.8">
            <v-card class="pa-4">
                <v-card-text>
                    <img class="qr-image" :src="qrImage" alt="qr"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-space-between">
                    <v-btn @click="copy">
                        {{ $t('sets.copyLink') }}
                    </v-btn>
                    <v-btn @click="open = false">
                        {{ $t('message.close') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {SET_STATUS} from "../../../store/modules/sets";

    export default {
        name: "SetInfo",
        computed: {
            ...mapGetters(["activeSet", "current"]),
            isActive: {
                get: function () {
                    return this.activeSet?.status === SET_STATUS.ACTIVE;
                }
            },
            inviteLink: {
                get: function () {
                    return `${location.origin}/sets/${this.activeSet.id}/join`;
                }
            },
            qrImage: {
                get: function () {
                    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(this.inviteLink)}`;
                }
            }
        },
        data() {
            return {
                SET_STATUS,
                loading: false,
                open: false
            }
        },
        methods: {
            ...mapActions(["getSetById", "updateSet", "getCocktails", "getTargetSetById"]),
            ...mapMutations(["setActiveSet", "addCocktail", "deleteInnerCocktail"]),
            async changeStatus(status) {
                this.loading = true;
                await this.updateSet({...this.activeSet, status});
                this.loading = false;
                if (status === SET_STATUS.CLOSED) {
                    this.setActiveSet({});
                    window.location.href = `${location.origin}/sets`
                }
            },
            copy() {
                navigator.clipboard.writeText(this.inviteLink);
            }
        },
        async mounted() {
            if (!this.activeSet.id) {
                return;
            }
            this.loading = true;
            const response = await this.getTargetSetById(this.activeSet.id);
            if (response?.status === 200) {
                this.setActiveSet(response.data);
            }
            this.loading = false;
        }
    }
</script>

<style scoped lang="scss">
    @import '~vuetify/src/styles/settings/_variables';

    .actions .v-btn.v-size--default {
        font-size: 11px;
    }

    img.qr-image {
        width: 100%;
    }

    .image {
        max-height: 48px;
        max-width: 48px;
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
        .image {
            max-height: 96px;
            max-width: 96px;
        }

        .actions.v-btn.v-size--default {
            font-size: 14px;
        }
    }
</style>