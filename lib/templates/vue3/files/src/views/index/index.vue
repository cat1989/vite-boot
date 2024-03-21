<template>
    <div>{{ greeting }}</div>
</template>

<script setup type="ts">
import { ref } from 'vue'
const greeting = ref('Hello world!')
</script>
