<template>
  <todos type="completed" />
</template>
<script>
import Todos from '@/components/Todos.vue';

export default {
  name: 'CompletedTodos',
  components: { Todos },
};
</script>
