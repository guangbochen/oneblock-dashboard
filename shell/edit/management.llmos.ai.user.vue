<script>
import { MANAGEMENT } from '@shell/config/types';
import CreateEditView from '@shell/mixins/create-edit-view';
import ChangePassword from '@shell/components/form/ChangePassword';
import { LabeledInput } from '@components/Form/LabeledInput';
import CruResource from '@shell/components/CruResource';
import { exceptionToErrorsArray } from '@shell/utils/error';
import { _CREATE, _EDIT } from '@shell/config/query-params';
import Loading from '@shell/components/Loading';

export default {
  components: {
    ChangePassword, CruResource, LabeledInput, Loading
  },
  mixins: [
    CreateEditView
  ],

  data() {
    return {
      form: {
        username:    this.value.username,
        description: this.value.description,
        displayName: this.value.displayName,
        password:    {
          password:          '',
          userChangeOnLogin: false,
        }
      },
      validation: {
        password:     false,
      },
    };
  },

  computed: {
    valid() {
      const valid = this.credentialsValid;

      if (this.isCreate) {
        return valid;
      }
      if (this.isEdit) {
        return valid && this.credentialsChanged;
      }

      return false;
    },
    credentialsValid() {
      if (this.isCreate) {
        // Username must be supplied, password valid
        return !!this.form.username && this.validation.password;
      }
      if (this.isEdit) {
        // Password must be valid (though password field doesn't have to exist)
        return this.validation.password;
      }

      return false;
    },
    credentialsChanged() {
      if (this.isCreate) {
        return true; // Covered by valid
      }
      if (this.isEdit) {
        return !!this.form.password.password ||
          this.form.description !== this.value.description ||
          this.form.displayName !== this.value.displayName ||
          this.form.password.userChangeOnLogin !== this.value.mustChangePassword;
      }

      return false;
    },
    isCreate() {
      return this.mode === _CREATE;
    },
    isEdit() {
      return this.mode === _EDIT;
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$refs.name) {
        this.$refs.name.focus();
      }
    });
  },
  methods: {
    async save(buttonDone) {
      this.errors = [];
      try {
        if (this.isCreate) {
          const user = await this.createUser();
        } else {
          await this.editUser();
        }

        this.$router.replace({ name: this.doneRoute });
        buttonDone(true);
      } catch (err) {
        this.errors = exceptionToErrorsArray(err);
        buttonDone(false);
      }
    },

    async createUser() {
      // Ensure username is unique (this does not happen in the backend)
      const users = await this.$store.dispatch('management/findAll', { type: MANAGEMENT.USER });

      if (users.find((u) => u.username === this.form.username)) {
        throw new Error(this.t('user.edit.credentials.username.exists'));
      }

      const user = await this.$store.dispatch('management/create', {
        type: MANAGEMENT.USER,
        metadata: {
          generateName: 'user-',
        },
        description:        this.form.description,
        isAdmin:            true,
        enabled:            true,
        mustChangePassword: this.form.password.userChangeOnLogin,
        displayName:        this.form.displayName,
        password:           this.form.password.password,
        username:           this.form.username
      });

      return await user.save();
    },

    async editUser() {
      if (!this.credentialsChanged) {
        return;
      }

      const user = await this.$store.dispatch('management/find', {
        type: MANAGEMENT.USER,
        id:   this.value.id,
      });

      // Save change of password
      // - Password must be changed before editing mustChangePassword (setpassword action sets this to false)
      if (this.form.password.password) {
        await this.$refs.changePassword.save(user);

        // Why the wait? Without these the user updates below are ignored
        // - The update request succeeds and shows the correct values in it's response.
        // - Fetching the norman user again sometimes shows the correct value, sometimes not
        // - Even if the fetched norman user shows the correct value, it doesn't show up in the steve user
        //   - Looks like we re-request the stale version via socket?
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      // Save user updates
      user.description = this.form.description;
      user._name = this.form.displayName;
      user.mustChangePassword = this.form.password.userChangeOnLogin;

      await user.save();

      return await this.$store.dispatch('management/find', {
        type: MANAGEMENT.USER,
        id:   this.value.id,
        opt:  { force: true }
      });
    },
  }
};
</script>

<template>
  <Loading v-if="!value" />
  <CruResource
    v-else
    :done-route="doneRoute"
    :mode="mode"
    :resource="value"
    :validation-passed="valid"
    :errors="errors"
    :can-yaml="false"
    class="create-edit"
    @finish="save"
  >
    <div class="credentials">
      <h2> {{ t("user.edit.credentials.label") }}</h2>
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            ref="name"
            v-model="form.username"
            label-key="user.edit.credentials.username.label"
            placeholder-key="user.edit.credentials.username.placeholder"
            :required="isCreate"
            :readonly="isEdit"
            :disabled="isView || isEdit"
            :ignore-password-managers="!isCreate"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            v-model="form.displayName"
            label-key="user.edit.credentials.displayName.label"
            placeholder-key="user.edit.credentials.displayName.placeholder"
            :disabled="isView"
          />
        </div>
      </div>
      <div class="row mt-20 mb-10">
        <div class="col span-8">
          <LabeledInput
            v-model="form.description"
            label-key="user.edit.credentials.userDescription.label"
            placeholder-key="user.edit.credentials.userDescription.placeholder"
            :disabled="isView"
          />
        </div>
      </div>

      <ChangePassword
        v-if="!isView"
        ref="changePassword"
        v-model="form.password"
        :mode="mode"
        :must-change-password="value.mustChangePassword"
        @valid="validation.password = $event"
      />
    </div>
  </CruResource>
</template>
