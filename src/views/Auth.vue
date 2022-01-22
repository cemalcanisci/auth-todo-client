<template>
  <div class="auth-wrapper">
    <v-row align="center" justify="center">
      <v-col xs="12" sm="6" md="6" lg="6" xl="4">
        <app-logo></app-logo>
        <div class="mx-2 mt-4">
          <v-form ref="form" lazy-validation @submit.prevent="send">
            <v-text-field
              v-if="isRegister"
              v-model="firstName"
              label="Name"
              placeholder="Name"
              color="primary"
              :rules="rules.nameRules"
              outlined
              required
            >
            </v-text-field>
            <v-text-field
              v-if="isRegister"
              v-model="lastName"
              label="Last Name"
              placeholder="Last Name"
              outlined
              required
              :rules="rules.nameRules"
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="E-mail"
              placeholder="E-mail"
              outlined
              required
              :rules="rules.emailRules"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              placeholder="Password"
              outlined
              required
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :rules="rules.password"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-text-field
              v-if="isRegister"
              v-model="password2"
              label="Re-Password"
              placeholder="Re-Password"
              outlined
              required
              :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword2 ? 'text' : 'password'"
              :rules="rules.password2"
              @click:append="showPassword2 = !showPassword2"
            ></v-text-field>
            <div class="d-flex justify-space-between align-start">
              <v-btn class="mr-4" large color="primary" type="submit" :loading="loading">{{
                saveButtonText
              }}</v-btn>
              <div
                class="change-auth-type"
                :class="{ passive: loading }"
                @click="isRegister = !isRegister"
              >
                {{ changeFormTypeText }}
              </div>
            </div>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AppLogo from '@/components/AppLogo.vue';

export default {
  name: 'Auth',
  components: { AppLogo },
  data() {
    return {
      valid: true,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password2: '',
      isRegister: false,
      loading: false,
      showPassword: false,
      showPassword2: false,
      rules: {
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) => (v && v.length >= 2) || 'Name must be more than 2 characters',
        ],
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        password: [(v) => !!v || 'Password is required'],
        password2: [
          (v) => !!v || 'Password is required',
          (v) => (v && v === this.password) || 'Re-Password should be equal password',
        ],
      },
    };
  },
  computed: {
    ...mapState(['user']),
    validate() {
      return this.$refs.form.validate();
    },
    changeFormTypeText() {
      return this.isRegister
        ? 'If you have a registered account, please click to login.'
        : 'If you have not registered yet, please click here.';
    },
    saveButtonText() {
      return this.isRegister ? 'Register' : 'Login';
    },
    payload() {
      const payload = {
        email: this.email,
        password: this.password,
      };
      if (this.isRegister) {
        payload.firstName = this.firstName;
        payload.lastName = this.lastName;
        payload.password2 = this.password2;
      }
      return payload;
    },
    saveMethodType() {
      return this.isRegister ? 'register' : 'login';
    },
  },
  methods: {
    ...mapActions(['login', 'register']),
    async send() {
      if (this.validate) {
        this.loading = true;
        try {
          await this[this.saveMethodType](this.payload);
          if (this.saveMethodType === 'register') {
            await this.login({
              email: this.email,
              password: this.password,
            });
          }
        } catch (error) {
          const { message } = error.response.data;
          this.$snotify.error(message);
        }
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.auth-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .change-auth-type {
    color: #1976d2;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    user-select: none;
    &.passive {
      color: #cecece;
      cursor: default;
    }
  }
}
</style>
