<script setup lang="ts">
import { defineColadaStore } from '@colada/colada-store';
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Example: App.vue - onMounted');
  defineColadaStore();
});
</script>

<template>
  <div>
    <h1>Colada Store – Vite + Vue 3</h1>
    <p>
      This example imports <code>defineColadaStore</code> from <code>@colada/colada-store</code>.
    </p>
  </div>
</template>
