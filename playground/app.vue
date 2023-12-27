<template>
  <div>
    Nuxt module playground!
    <pre>tets: {{ test }}</pre>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const test = computed(() => store.state.something.rr);

    return { test };
  },
};
</script>
