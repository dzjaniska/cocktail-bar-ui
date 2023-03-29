<template>
    <v-container class="text-center my-16">
        <h1 class="mb-4">
            {{ $t("message.welcome") }}
        </h1>
    </v-container>
</template>

<script>
    export default {
        name: 'Home',
        data() {
            return {
                error: false,
                response: ""
            }
        }
    }
</script>
