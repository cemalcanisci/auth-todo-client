<template>
  <v-dialog v-model="dialog" width="700">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" icon :color="iconColor">
        <v-icon size="20">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-card class="confirm-modal-wrapper">
      <v-card-title class="text-h5"> {{ cardTitle }} </v-card-title>
      <v-card-text>
        <div class="py-4">
          {{ cardContent }}
          <span class="name">{{ name }}</span>
        </div>
        <div class="actions d-flex justify-end align-center">
          <v-btn class="mr-4" color="error" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="confirm">{{ methodText }}</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'ConfirmModal',
  props: {
    iconColor: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    methodType: {
      type: String,
      required: true,
    },
    isTodo: {
      type: Boolean,
      default: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    name() {
      return this.item.text || this.item.name;
    },
    methodText() {
      return this.methodType === 'delete' ? 'Delete' : 'Update';
    },
    cardTitle() {
      return `${this.methodText} ${this.isTodo ? 'Todo' : 'Group'}`;
    },
    contentType() {
      return this.methodType === 'delete' ? 'delete' : 'update status';
    },
    toOppositeStatus() {
      if (this.item.status && this.methodType === 'update') {
        return this.item.status === 'active' ? 'to completed' : 'to active';
      }
      return '';
    },
    cardContent() {
      return `Are you sure want to ${this.contentType} ${this.toOppositeStatus}`;
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    confirm() {
      this.$emit(this.methodType, this.isTodo, this.item);
      this.dialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.confirm-modal-wrapper {
  .name {
    color: red;
  }
}
</style>
