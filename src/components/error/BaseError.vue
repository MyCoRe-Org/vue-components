<template>
  <div class="alert alert-danger">
    <h1>{{ message }}</h1>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  description: string;
}
defineProps<Props>();
</script>
<style></style>
