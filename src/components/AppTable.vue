<template>
  <v-card>
    <v-card-title>
      {{ pageTitle }}
      <v-spacer></v-spacer>
      <v-row v-if="tableType === 'todo'" align="center" justify="center">
        <v-col>
          <v-select
            hide-details
            outlined
            dense
            v-model="selectedPriority"
            :items="priorityItems"
            clearable
            label="Priority"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            hide-details
            outlined
            dense
            v-model="selectedGroupId"
            :items="groups"
            clearable
            item-text="name"
            item-value="id"
            label="Group"
          ></v-select>
        </v-col>
        <v-col>
          <v-menu
            v-model="menuMinDate"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                clearable
                hide-details
                outlined
                dense
                v-model="selectedMinDate"
                label="Min Due Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="selectedMinDate" @input="menuMinDate = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu
            v-model="menuMaxDate"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                clearable
                hide-details
                outlined
                dense
                v-model="selectedMaxDate"
                label="Max Due Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="selectedMaxDate" @input="menuMaxDate = false"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" width="700">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mr-4" large color="primary" v-bind="attrs" v-on="on">{{ modalType }}</v-btn>
        </template>
        <v-card class="app-table-wrapper">
          <v-card-title class="text-h5"> {{ modalType }} </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation @submit.prevent="add">
              <v-text-field
                v-model="title"
                label="Title"
                placeholder="Title"
                color="primary"
                outlined
                required
                :rules="rules.titleRules"
              >
              </v-text-field>
              <v-select
                v-if="tableType === 'todo'"
                v-model="groupId"
                :items="mappedGroups"
                item-text="text"
                item-value="value"
                label="Group"
                :rules="rules.notNull"
                outlined
              ></v-select>

              <v-row>
                <v-col>
                  <v-select
                    v-if="tableType === 'todo'"
                    v-model="priority"
                    :items="priorityItems"
                    item-text="text"
                    item-value="value"
                    label="Priority"
                    outlined
                  ></v-select>
                </v-col>
                <v-col>
                  <v-menu
                    v-if="tableType === 'todo'"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        required
                        v-model="dueDate"
                        color="primary"
                        outlined
                        placeholder="Due Date"
                        label="Due Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules.notNull"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dueDate"
                      :min="today"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

              <div class="actions d-flex justify-end align-center">
                <v-btn large class="mr-4" color="error" @click="dialog = false">Cancel</v-btn>
                <v-btn large color="warning" class="mr-4" @click="reset"> Reset </v-btn>
                <v-btn large color="primary" type="submit">{{ modalType }}</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table :headers="headers" :items="tableItems" :loading="loading">
      <template v-slot:[`item.priority`]="{ item }">
        <span :class="`priority-${item.priority}`">{{ priorities[item.priority] }}</span>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <span class="todo-status" :class="item.status">{{
          item.status === 'active' ? 'Active' : 'Completed'
        }}</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <confirm-modal
          icon-color="red accent-1"
          icon="mdi-delete"
          method-type="delete"
          :is-todo="Boolean(item.groupId)"
          :item="item"
          @delete="deleteItem"
        />

        <edit-modal :item="item" @edit="edit" />
        <confirm-modal
          v-if="item.groupId"
          method-type="update"
          :icon-color="item.status === 'active' ? 'green' : 'red'"
          :icon="item.status === 'active' ? 'mdi-check' : 'mdi-window-close'"
          :item="item"
          @update="update"
        />
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import EditModal from '@/components/common/EditModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
/* eslint-disable arrow-body-style */

export default {
  props: {
    pageTitle: {
      type: String,
      required: true,
    },
    tableType: {
      type: String,
      default: 'todo',
    },
    headers: {
      type: Array,
      required: true,
    },
    todoType: {
      type: String,
      default: 'active',
    },
  },
  components: { EditModal, ConfirmModal },
  data() {
    return {
      dialog: false,
      title: '',
      priority: 1,
      groupId: '',
      menu: false,
      selectedPriority: null,
      selectedGroupId: null,
      selectedMinDate: null,
      selectedMaxDate: null,
      menuMinDate: false,
      menuMaxDate: false,
      today: new Date().toISOString().slice(0, 10),
      dueDate: new Date().toISOString().slice(0, 10),
      rules: {
        titleRules: [
          (v) => !!v || 'Name is required',
          (v) => (v && v.length >= 2) || 'Name must be more than 2 characters',
        ],
        notNull: [(v) => !!v || 'This field is required'],
      },

      priorityItems: [
        { text: 'Lowest', value: 1 },
        { text: 'Low', value: 2 },
        { text: 'Medium', value: 3 },
        { text: 'High', value: 4 },
        { text: 'Highest', value: 5 },
      ],
      priorities: {
        1: 'Lowest',
        2: 'Low',
        3: 'Medium',
        4: 'High',
        5: 'Highest',
      },
      loading: false,
    };
  },
  computed: {
    ...mapState(['groups', 'todos']),
    ...mapGetters(['getGroupByValue']),
    validate() {
      return this.$refs.form.validate();
    },
    modalType() {
      return this.tableType === 'todo' ? 'Add Todo' : 'Add Group';
    },
    methodType() {
      return this.tableType === 'todo' ? 'addTodo' : 'addGroup';
    },
    successMessage() {
      return this.tableType === 'todo' ? 'Todo added successfully' : 'Group added successfully';
    },
    editSuccessMessage() {
      return this.tableType === 'todo' ? 'Todo edited successfully' : 'Group edited successfully';
    },
    payload() {
      const payload = {};
      if (this.tableType === 'group') {
        payload.name = this.title;
      } else {
        payload.text = this.title;
        payload.priority = this.priority;
        payload.status = 'active';
        payload.groupId = this.groupId;
        payload.dueDate = this.dueDate;
      }
      return payload;
    },
    mappedGroups() {
      if (this.groups.length) {
        return this.groups.map((group) => {
          return {
            text: group.name,
            value: group.id,
          };
        });
      }
      return [];
    },
    tableItems() {
      return this.tableType === 'todo' ? this.tableTodoItems : this.groups;
    },
    tableTodoItems() {
      if (this.todos.length) {
        return this.todos.map((todo) => {
          return {
            id: todo.id,
            text: todo.text,
            priority: todo.priority,
            groupId: this.getGroupByValue(todo.groupId).name,
            status: todo.status,
            dueDate: new Date(todo.dueDate).toISOString().slice(0, 10),
          };
        });
      }
      return [];
    },
    query() {
      const query = {
        status: this.todoType,
      };

      if (this.selectedGroupId) {
        query.groupId = this.selectedGroupId;
      }

      if (this.selectedPriority) {
        query.priority = this.selectedPriority;
      }

      if (this.selectedMinDate) {
        query.minDueDate = this.selectedMinDate;
      }

      if (this.selectedMaxDate) {
        query.maxDueDate = this.selectedMaxDate;
      }
      return query;
    },
  },
  created() {
    if (this.tableType === 'todo') {
      this.fetch();
    }
  },
  methods: {
    ...mapActions([
      'addGroup',
      'addTodo',
      'fetchTodos',
      'editTodo',
      'editGroup',
      'fetchGroups',
      'deleteTodo',
      'deleteGroup',
      'updateTodoStatus',
    ]),
    reset() {
      this.$refs.form.reset();
    },
    resetFields() {
      this.title = '';
      this.priority = 1;
      this.groupId = '';
      this.dueDate = new Date().toISOString().slice(0, 10);
    },
    async add() {
      try {
        await this[this.methodType](this.payload);
        this.dialog = false;
        this.$snotify.success(this.successMessage);
        this.resetFields();

        if (this.methodType === 'addTodo') {
          this.fetch();
        }
      } catch (error) {
        const { message } = error.response.data;
        this.$snotify.error(message);
      }
    },
    async fetch() {
      try {
        await this.fetchTodos(this.query);
      } catch (error) {
        this.$snotify.error('There was a problem fetching todos');
      }
    },
    async edit(data) {
      const { methodType, id, payload } = data;
      this.loading = true;

      try {
        await this[methodType]({ id, payload });
        this.dialog = false;
        this.$snotify.success(this.editSuccessMessage);
        if (methodType === 'editTodo') {
          this.fetch();
        } else {
          this.fetchGroups();
        }
        this.loading = false;
      } catch (error) {
        const { message } = error.response.data;
        this.$snotify.error(message);
        this.loading = false;
      }
    },
    async deleteItem(isTodo, item) {
      const method = isTodo ? 'deleteTodo' : 'deleteGroup';
      try {
        await this[method](item.id);
        this.$snotify.success(`${isTodo ? 'Todo' : 'Group'} deleted successfully`);
        if (!isTodo) {
          await this.fetchGroups();
        }
        this.fetch();
      } catch (error) {
        const { message } = error.response.data;
        this.$snotify.error(message);
      }
    },
    async update(isTodo, item) {
      const payload = { status: item.status === 'active' ? 'completed' : 'active' };
      try {
        await this.updateTodoStatus({ id: item.id, payload });
        this.$snotify.success('Todo status updated successfully');
        this.fetch();
      } catch (error) {
        const { message } = error.response.data;
        this.$snotify.error(message);
      }
    },
  },
  watch: {
    query: {
      deep: true,
      handler() {
        this.fetch();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.app-table-wrapper {
  .actions {
    width: 100%;
  }
}
.todo-status {
  &.completed {
    color: green;
  }
  &.active {
    color: red;
  }
}
.priority-1 {
  color: #6f975c;
}
.priority-2 {
  color: #d2d462;
}
.priority-3 {
  color: #ff6361;
}
.priority-4 {
  color: #bc5090;
}
.priority-5 {
  color: #494ca2;
}
</style>
