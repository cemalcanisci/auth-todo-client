<template>
  <app-table :page-title="pageTitle" :table-type="'todo'" :headers="headers" :todo-type="type" />
</template>
<script>
import AppTable from '@/components/AppTable.vue';

export default {
  name: 'Todos',
  components: { AppTable },
  props: {
    type: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      headers: [
        {
          text: 'Title',
          align: 'center',
          sortable: false,
          value: 'text',
        },
        {
          text: 'Priority',
          value: 'priority',
          sortable: false,
          align: 'center',
        },
        {
          text: 'Status',
          value: 'status',
          sortable: false,
          align: 'center',
        },
        {
          text: 'Group',
          value: 'groupId',
          sortable: false,
          align: 'center',
        },
        {
          text: 'Due Date',
          value: 'dueDate',
          sortable: false,
          align: 'center',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          align: 'center',
        },
      ],
    };
  },
  computed: {
    pageTitle() {
      return this.type === 'active' ? 'Active Todos' : 'Completed Todos';
    },
  },
};
</script>
