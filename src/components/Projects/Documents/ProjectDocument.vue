<template>
  <div class="document" :class="{'loading': is_loading}">
    <div class="image">
      <div class="image-extension-background" @click="download">
        <div class="image-extension">
          {{ getFileExtension(document.origin_file_name) }}
        </div>
      </div>
      <div class="share-link" @click.prevent="handleCopyLink">
        <IconShare />
      </div>
    </div>
    <div class="name">
      {{ document.name }}
    </div>
  </div>
</template>

<script lang="ts">

import {getProjectDocumentDownloadHash} from "@/api/projects";
import {message} from "ant-design-vue";
import UseErrorStore from "@/stores/messages";

export default {
  name: 'ProjectDocument',

  props: {
    document: { required: true },
  },

  data() {
    return {
      is_loading: false,
    }
  },

  methods: {
    getFileExtension: function (fileName) {
      // Use a regular expression to match the file extension
      const extension = fileName.match(/\.([^.]+)$/);

      // Check if the extension exists and return it, else return empty string
      return extension ? extension[1].toUpperCase() : '';
    },

    handleCopyLink: async function () {
      this.is_loading = true;

      try {
        const { hash } = await getProjectDocumentDownloadHash(this.$route.params.project, this.document.id);

        const url = import.meta.env.VITE_APP_API_URL + `/download/${hash}`

        this.copyToClipboard(url);

        UseErrorStore.changeSuccessText('The one-time download link has been successfully copied (valid for 1 day).');
      } finally {
        this.is_loading = false;
      }
    },

    copyToClipboard: function(text) {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = text;

      // Styling to hide the textarea off the screen
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';

      // Append the textarea to the body
      document.body.appendChild(textarea);

      // Select the text inside the textarea
      textarea.select();

      // Execute the copy command
      document.execCommand('copy');

      // Remove the textarea from the document
      document.body.removeChild(textarea);
    },

    download: async function () {
      this.is_loading = true;

      try {
        const { hash } = await getProjectDocumentDownloadHash(this.$route.params.project, this.document.id);

        const url = import.meta.env.VITE_APP_API_URL + `/download/${hash}`
        window.open(url, "_blank");
      } finally {
        this.is_loading = false;
      }
    },
  }
}

</script>

<style scoped lang="scss">

.loading {
  cursor: progress!important;
}

.document {
  margin: 6px;
  border-radius: 4px;
  display: inline-block;
  cursor: pointer;
  position: relative;
  width: 200px;
  height: content-box;

  .name {
    background: $neutrals-background-semi;
    color: $neutrals-text-primary;
    padding: 2px 6px;
    width: 100%;
  }
}

.share-link {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 5px 2px 5px;
  border-radius: 5px;
}

.share-link:hover {
  background-color: rgba(0, 0, 0, 0.23);
}

.image {
  background: url(/images/file.png) no-repeat center ;
  background-size: contain;
  width: 200px;
  height: 200px;
  position: relative;

  .image-extension-background {
    width: 100%;
    height: 100%;
    padding-top: 43px;
    transition: background 0.2s;
  }

  .image-extension {
    font-family: Arial,serif;
    position: relative;
    width: min-content;
    background: #4d95cb;
    border-radius: 6px;
    margin: auto;
    color: $neutrals-text-invert;
    font-weight: 900;
    font-size: 25px;
    padding: 0px 8px;
    transition: opacity 0.2s;
    min-width: 100px;
    text-align: center;
  }
}

.document:hover {
  .image-extension-background {
    background: rgba(0, 0, 0, 0.63);
    transition: background 0.2s;
  }
}
</style>