<template>
  <AddProjectDocumentModal
    v-on:uploaded="loadDocuments"
  />
  <ProjectTabs>
    <template #documents>
      <div class="document-container">
        <template v-for="document in documents" :key="document.id">
          <ProjectDocument :document="document" />
        </template>
      </div>
    </template>
  </ProjectTabs>
</template>

<script lang="ts">

import {getProjectDocuments} from "@/api/projects";
import ProjectDocument from "@/components/Projects/Documents/ProjectDocument.vue";
import AddProjectDocumentModal from "@/components/Projects/Documents/AddProjectDocumentModal.vue";

export default {
  name: 'ProjectDocuments',

  components: {
    ProjectDocument,
    AddProjectDocumentModal,
  },

  mounted() {
    this.loadDocuments();
  },

  data() {
    return {
      documents: [],
    };
  },

  methods: {
    loadDocuments: async function () {
      const { data } = await getProjectDocuments(Number(`${this.$route.params.project}`));

      this.documents = data;
    },
  },

}

</script>


<style scoped lang="scss">

.document-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}


</style>