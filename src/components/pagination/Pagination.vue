<template>
    <v-pagination
            v-model="current"
            :length="totalPages"
            :total-visible="visible"
            @input="onChange($event - 1)"/>
</template>

<script>
    export default {
        name: "Pagination",
        props: {
            onChange: Function,
            page: Number,
            totalPages: Number,
            visible: {
                type: Number,
                default: 7
            }
        },
        data() {
            return {
                current: this.page + 1 || 1
            }
        }
    }
</script>

<style scoped>

</style>