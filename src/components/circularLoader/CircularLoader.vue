<template>
    <div v-if="!!loading" class="v-overlay">
        <v-progress-circular indeterminate color="accent"/>
    </div>
</template>

<script>
    export default {
        name: "CircularLoader",
        props: {
            loading: Boolean
        }
    }
</script>

<style lang="scss" scoped>
    .v-overlay {
        background-color: #BDBDBD;
        opacity: 0.5;
        z-index: 1000;

        .v-progress-circular {
            z-index: 110;
        }
    }
</style>