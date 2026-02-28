<script setup lang="ts">
import { defineColadaStructure } from '@colada/colada-store';
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Example: App.vue - onMounted');
  const defineSimpleStructure = defineColadaStructure(({ StructureAccessorPresets }) => [
    { state: { type: 'object', vue: 'reactive' } },
    { getters: { type: 'object', vue: 'computed' } },
    { methods: { type: 'function' } },
  ]);
  const instance = defineSimpleStructure(() => ({
    state: { count: 0 },
    getters: ({ state }: { state: { count: number } }) => ({ double: () => state.count * 2 }),
    methods: ({ state, getters }) => ({
      increment: () => {
        console.log('increment before: count:', state.count, 'double:', getters.double);
        state.count++;
        console.log('increment after: count:', state.count, 'double:', getters.double);
      },
    }),
  }));

  const { count, double, increment } = instance.useComposable();
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
