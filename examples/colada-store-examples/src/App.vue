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
  type State = { count: number };
  type Getters = { double: () => number };
  type Methods = { increment: () => void };
  const instance = defineSimpleStructure<[State, Getters, Methods]>(() => ({
    state: { count: 0 },
    getters: ({ state }) => ({
      double: () => state.count * 2,
    }),
    methods: ({ state, getters }) => ({
      increment: () => {
        console.log('increment before: count:', state.count, 'double:', getters.double);
        state.count++;
        console.log('increment after: count:', state.count, 'double:', getters.double);
      },
    }),
  }));

  const { state, getters, methods } = instance.useComposable();
  const { count } = state;
  const double = getters.double;
  const increment = methods.increment;
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
