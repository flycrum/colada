<script setup lang="ts">
import { defineColadaStructure } from '@colada/colada-store';
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Example: App.vue - onMounted');
  const defineSimpleStructure = defineColadaStructure(({ StructureAccessorTypes }) => [
    { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
    { getters: StructureAccessorTypes.OBJECT_COMPUTED },
    { methods: StructureAccessorTypes.METHODS },
  ]);
  const instance = defineSimpleStructure(() => ({
    state: { count: 0 },
    getters: ({ state }) => ({ double: () => state.count * 2 }),
    methods: ({ state, getters }) => ({ increment: () => {} }),
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
