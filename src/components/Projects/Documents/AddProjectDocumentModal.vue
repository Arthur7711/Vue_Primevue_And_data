<template>
  <div>
    <button class="add-document" @click="showModal">Add document</button>
    <a-modal
      :confirm-loading="loading"
      :visible="visible"
      @ok="handleOk"
      @cancel="close"
    >
      <template v-if="loading">
        <h1>Uploading file...</h1>
      </template>
      <template v-else>
        <h1>Upload document</h1>

        <form >
          <div class="row">
            <input
              :class="{'error': 'name' in formErrors}"
              class="text-input"
              type="text"
              placeholder="Type name..."
              @change="clearErrors"
              v-model="name"
            >
            <p v-if="formErrors.name" class="error-text">{{ formErrors.name }}</p>
          </div>

          <div class="row">
            <input
              type="file"
              ref="file"
              @change="handleFileChange"
            >
            <p v-if="formErrors.file" class="error-text">{{ formErrors.file }}</p>
          </div>
        </form>
        <p v-if="formErrors.api" class="error-text">API ERROR: {{ formErrors.api }}</p>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {addProjectDocument} from "@/api/projects";
import {AxiosError} from "axios";

export default {
  name: 'AddProjectDocumentModal',

  data() {
    return {
      formErrors: {},

      visible: false,
      loading: false,

      name: '',
      selectedFile: null,
    }
  },

  methods: {
    clearErrors: function() {
      this.formErrors = {};
    },

    close: function() {
      this.visible = false;
    },

    handleFileChange: function(event) {
      this.clearErrors();
      this.selectedFile = event.target.files[0];
    },

    validate: function () {
      this.clearErrors();

      if (this.name.trim() === '') {
        this.formErrors.name = 'Name is required.';
      }

      if (!this.selectedFile) {
        this.formErrors.file = 'File is required.';
      }
    },

    submitForm: async function() {
      // Create FormData object
      const formData = new FormData();

      // Append form data
      formData.append('name', this.name);

      // Append file data
      formData.append('file', this.selectedFile);

      await addProjectDocument(
        Number(`${this.$route.params.project}`),
        this.name,
        this.selectedFile,
      );
    },

    showModal: function() {
      this.loading = false;
      this.visible = true;

      this.name = '';
      this.selectedFile = null;
    },

    handleOk: async function() {
      this.validate();

      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      this.loading = true;

      try {
        await this.submitForm();

        this.visible = false;

        this.$emit('uploaded');
      } catch (e: AxiosError) {
        if (e.response) {
          if (e.response.status == 413) {
            this.formErrors.api = 'File is too big!'
          } else {
            this.formErrors.api = 'No server response received!'
          }
        } else if (e.request) {
          this.formErrors.api = 'No server response received!'
        } else {
          // Something happened in setting up the request that triggered an error
          this.formErrors.api = e.message;
        }
      } finally {
        this.loading = false;
      }
    },
  }

}
</script>

<style scoped lang="scss">

@import 'ant-design-vue/dist/antd.css';

.error {
  border: 2px solid $danger-background-default!important;
}

.row {
  margin: 12px 0;
}

.text-input {
  width: 100%;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid #b8b9be;
  resize: none;
  overflow: auto;
}

.text-input:focus {
  outline: none;
}

.add-document {
  background: $primary-text-default;
  border: none;
  padding: 8px 16px 8px 16px;
  border-radius: 8px;
  gap: 4px;
  color: $neutrals-text-invert;
  font-weight: 600;
  position: absolute;
  top: 130px;
  right: 5%;
  cursor: pointer;
  z-index: 1;
}

.error-text {
  margin: 0;
  color: red;
}

</style>