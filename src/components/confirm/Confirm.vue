<template>
    <v-dialog v-bind:value="open"
              max-width="480"
              persistent
              overlay-opacity="0.8">
        <v-card class="pa-4">
            <p class="body-1 text-center mb-4">
                {{label}}
            </p>
            <v-btn color="success"
                   class="mr-4"
                   @click="onConfirm">
                {{ $t('message.yes') }}
            </v-btn>
            <v-btn color="error"
                   class="mr-4 float-right"
                   @click="onReject">
                {{ $t('message.no') }}
            </v-btn>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "Confirm",
        props: {
            open: Boolean,
            onConfirm: Function,
            onReject: Function,
            label: String
        }
    }
</script>

<style scoped>

</style>