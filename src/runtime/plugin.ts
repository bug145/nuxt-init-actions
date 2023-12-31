import { defineNuxtPlugin } from '#app';
import { useStore } from 'vuex';
import type { StoreExtended } from '../../types';

const flow = (funcs: any[]) => (...args: any) => funcs.reduce((prev: any, fnc) => [fnc(...prev)], args)[0];

const getContains = (items: string[], needle: string): string[] => {
  const pattern = new RegExp(`\\/?${needle}`);

  return flow([
    (arr: Array<string>): Array<string> => arr.map((val) => {
      if (pattern.test(val)) {
        return val;
      }
      return '';
    }),
    (arr: string[]): string[] => arr.filter((e) => e),
  ])(items);
}

export default defineNuxtPlugin({
  name: "initActions:vuex",
  setup(nuxt) {
    const store: StoreExtended = useStore();
    if (store === undefined) {
      console.error(new Error('The store is not defined in the application'));
      return;
    }
    if (!(store._actions instanceof Object)) {
      console.error(new Error('Store not includes actions'));
      return;
    }
    const actions: Array<string> = Object.keys(store._actions);


    nuxt.hook('app:rendered', async () => {
      const handleServerInit = async () => {
        const serverInitActions = flow([
          (arr: string[]) => getContains(arr, 'nuxtServerInit'),
          (arr: string[]) => arr.map((e) => store.dispatch(e)),
        ])(actions);

        try {
          await Promise.all(serverInitActions);
          nuxt.payload.vuex = store.state;
        }
        catch (e) {
          console.error(e);
        }
      };

      if (process.server) {
        await handleServerInit();
      }
    });

    nuxt.hook("app:mounted", async () => {
      const handleClientInit = async () => {
        const clientInitActions = flow([
          (arr: string[]) => getContains(arr, 'nuxtClientInit'),
          (arr: string[]) => arr.map((e) => store.dispatch(e)),
        ])(actions);

        try {
          if (nuxt.payload && nuxt.payload.vuex) {
            store.replaceState(nuxt.payload.vuex);
          }

          await Promise.all(clientInitActions);
        }
        catch (e) {
          console.error(e);
        }
      };

      if (process.client) {
        await handleClientInit();
      }
    });

  }
})