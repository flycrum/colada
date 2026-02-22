# define-colada-store

Package overview: [colada.reqs.md](./colada.reqs.md).

## Purpose

Requirements and long-term vision for the `defineColadaStore` API. Singleton/global store behavior is specific to defineColadaStore; core state/action/getter logic is built on [define-colada-structure](./define-colada-structure.ts). Implementation: [define-colada-store.ts](./define-colada-store.ts).

## Planned definition and usage API

```
// definition of store

// requirement: `defineColadaStore` call should return a wrapper object with a dynamically named and typed composable with the prefix "use" + capitalized definition "id" prop + "Store" suffix (making naming deterministic and easier to refactor)
// requirement: `defineColadaStore` signature should only support a factory function as the first parameter
export const { useLoadingStore } = defineColadaStore(() => ({
  id: 'loading',
  deps: () => ({
    mediaService: mediaServiceApi,
    user: getUser(),
  }),
  constants: () => ({
    errorMessage: 'Ope, that sure didn't work 🫠'
  }),
  state: () => ({
    errorCode: undefined as '404' | '502' | undefined,
    isLoading: false,
    result: [] as string[],
  }),
  getters: ({ state }) => ({
    hasError() {
      return !!state.errorCode;
    },
    hasErrorAndNotLoading() {
      return this.hasError() && !state.isLoading;
    },
  }),
  helpers: ({ state, deps }) => ({
    callApi: async() => {
      deps.mediaService.load({
        user: deps.user,
      });
    }
  }),
  actions: ({ state, helpers }) => ({
    resetResults() {
      state.result = [];
    },
    loadMedia() {
      helpers.callApi();
    }
  }),
  hooks: () => ({
    onInit() {
        console.log('🆕 Store initialized!')
    }
  })
}))

// usage of store

// requirement: the `useLoadingStore` composable call should return a wrapper object with a dynamically named and typed instance of the store with definition "id" prop + "Store" suffix (making naming deterministic and easier to refactor)
const { loadingStore } = useLoadingStore();

// access state
loadingStore.errorMessage;
loadingStore.errorCode;
loadingStore.isLoading;
loadingStore.result;
loadingStore.hasError();
loadingStore.hasErrorAndNotLoading();

// call actions
loadingStore.resetResults();
loadingStore.loadMedia();

// internals: one per accessor name from StructureAccessorsConfig, plus _structureAccessorsConfig
loadingStore._id;
loadingStore._deps;
loadingStore._constants;
loadingStore._state;
loadingStore._getters;
loadingStore._helpers;
loadingStore._actions;
loadingStore._hooks;
loadingStore._structureAccessorsConfig;
```

## Requirements

- direct accessing of the store via `loadingStore` should allow reading state but not writing to it directly. We should restrict and all mutations should go through `actions` and `helpers`
