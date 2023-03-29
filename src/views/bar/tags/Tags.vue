<template>
    <v-container class="text-center d-flex flex-column container">
        <v-row class="align-center mb-4" style="flex: none">
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <h2>{{$t("message.tags")}}</h2>
            </v-col>
            <v-col cols="2">
                <h4 class="hidden-xs-only">{{ $t('tags.tagCreate') }}</h4>
                <v-icon @click="() => open = true">
                    {{ "mdi-plus-circle-multiple"}}
                </v-icon>
            </v-col>
        </v-row>
        <v-data-table
                hide-default-header
                :headers="headers"
                :items="tags"
                :items-per-page="1000"
                disable-items-per-page
                hide-default-footer
                mobile-breakpoint="0">
            <template v-slot:item.edit="{ item }">
                <v-icon @click="selectTag(item, () => open = true)">
                    {{ "mdi-pencil"}}
                </v-icon>
            </template>
            <template v-slot:item.delete="{ item }">
                <v-icon @click="selectTag(item, () => openConfirm = true)">
                    {{ "mdi-delete"}}
                </v-icon>
            </template>
        </v-data-table>
        <v-dialog v-bind:value="open"
                  max-width="480"
                  persistent
                  overlay-opacity="0.8">
            <v-row>
                <v-icon class="ml-auto" @click="closeDialog()">
                    {{ "mdi-close"}}
                </v-icon>
            </v-row>
            <v-card class="pa-4">
                <v-form>
                    <v-row justify="space-between">
                        <v-col cols="12" md="5">
                            <v-text-field outlined
                                          v-model="current.label.labelEn"
                                          :label="$t('message.titleEn')"
                                          :rules="[rules.required]"
                                          required/>
                        </v-col>
                        <v-col cols="12" md="5">
                            <v-text-field
                                    outlined
                                    v-model="current.label.labelRu"
                                    :label="$t('message.titleRu')"
                                    required/>
                        </v-col>
                    </v-row>
                    <v-row class="justify-end mx-2">
                        <v-btn color="success"
                               @click="submit()">
                            {{ $t('message.submit') }}
                        </v-btn>
                    </v-row>
                </v-form>
            </v-card>
        </v-dialog>
        <confirm v-bind:open="openConfirm"
                 :label="$t('label.deleteWarning')"
                 v-bind:onConfirm="() => deleteCurrentTag()"
                 v-bind:onReject="() => openConfirm = false"/>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import Confirm from "../../../components/confirm/Confirm";

    export default {
        name: "Tags",
        components: {Confirm},
        computed: mapGetters(["tags"]),
        data() {
            return {
                loading: false,
                open: false,
                openConfirm: false,
                headers: [
                    {value: 'label.labelEn'},
                    {value: 'label.labelRu'},
                    {value: 'edit', align: 'end'},
                    {value: 'delete', align: 'end'},
                ],
                rules: {
                    required: value => !!value || this.$t("form.required")
                },
                current: {
                    id: undefined,
                    label: {
                        labelEn: "",
                        labelRu: ""
                    }
                }
            }
        },
        methods: {
            ...mapActions(["getTags", "createTag", "updateTag", "deleteTag"]),
            async change(page) {
                this.loading = true;
                await this.getTags({page});
                this.loading = false;
            },
            selectTag(tag, callback) {
                callback();
                this.current = {
                    id: tag.id,
                    label: {
                        id: tag.label.id,
                        labelEn: tag.label.labelEn,
                        labelRu: tag.label.labelRu
                    }
                };
            },
            closeDialog() {
                this.open = false;
                this.openConfirm = false;
                this.current = {
                    id: undefined,
                    label: {
                        id: "",
                        labelEn: "",
                        labelRu: ""
                    }
                };
            },
            async submit() {
                this.loading = true;
                this.current.id ? await this.updateTag(this.current) : await this.createTag(this.current);
                await this.getTags();
                this.closeDialog();
                this.loading = false;
            },
            async deleteCurrentTag() {
                this.loading = true;
                await this.deleteTag(this.current.id);
                await this.getTags();
                this.closeDialog();
                this.loading = false;
            }
        },
        async mounted() {
            this.loading = true;
            await this.getTags();
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