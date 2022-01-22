<template>
  <v-dialog v-model="dialog" width="700">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" icon color="blue">
        <v-icon size="20">mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card class="edit-modal-wrapper">
      <v-card-title class="text-h5"> {{ modalType }} </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation @submit.prevent="edit">
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
            v-if="item.groupId"
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
                v-if="item.groupId"
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
                v-if="item.groupId"
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
                <v-date-picker v-model="dueDate" :min="today" @input="menu = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <div class="actions d-flex justify-end align-center">
            <v-btn large class="mr-4" color="error" @click="dialog = false">Cancel</v-btn>
            <v-btn large color="primary" type="submit">{{ modalType }}</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
/* eslint-disable arrow-body-style */
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'EditModal',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['groups']),
    ...mapGetters(['getGroupByValue']),
    modalType() {
      return this.item.groupId ? 'Edit Todo' : 'Edit Group';
    },
    methodType() {
      return this.item.groupId ? 'editTodo' : 'editGroup';
    },
    successMessage() {
      return this.item.groupId ? 'Todo edited successfully' : 'Group edited successfully';
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
    payload() {
      const payload = {};
      if (!this.item.groupId) {
        payload.name = this.title;
      } else {
        payload.text = this.title;
        payload.priority = this.priority;
        payload.status = this.status;
        payload.groupId = this.groupId;
        payload.dueDate = this.dueDate;
      }
      return payload;
    },
  },
  data() {
    return {
      dialog: false,
      title: '',
      priority: null,
      groupId: null,
      menu: false,
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
    };
  },
  mounted() {
    if (this.item.groupId) {
      this.title = this.item.text;
      this.priority = this.item.priority;
      this.status = this.item.status;
      this.groupId = this.getGroupByValue(this.item.groupId, 'name').id;
      this.dueDate = new Date(this.item.dueDate).toISOString().slice(0, 10);
    } else {
      this.title = this.item.name;
    }
  },
  methods: {
    edit() {
      this.$emit('edit', { methodType: this.methodType, id: this.item.id, payload: this.payload });
      this.dialog = false;
    },
  },
};
</script>
