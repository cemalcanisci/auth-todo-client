<template>
  <div>
    <app-table page-title="Groups" :table-type="'group'" :headers="headers" />
  </div>
</template>
<script>
import AppTable from '@/components/AppTable.vue';

export default {
  name: 'Groups',
  components: { AppTable },
  data() {
    return {
      headers: [
        {
          text: 'Title',
          sortable: false,
          value: 'name',
          align: 'center',
        },
        {
          text: 'Actions',
          sortable: false,
          value: 'actions',
          align: 'center',
        },
      ],
    };
  },
  methods: {},
};
</script>
