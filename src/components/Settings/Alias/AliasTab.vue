<template>
  <div class="loading" v-if="aliasStore.loading">
    <a-spin tip="Loading..." size="large" />
  </div>
  <div v-else>
    <Modal
      :title="'Create Department'"
      :buttonName="'ADD DEPARTMENT'"
      @handle-ok="toggleModal(true)"
      @cancel="toggleModal(true)"
      @show-modal="toggleModal(true)"
      v-model:open="openDepartment"
    >
      <template #slot_form>
        <Form @submit="submit" input-label="Department" :aliases="aliases" />
      </template>
    </Modal>
    <AliasTable
      style="margin-top: 0.5rem"
      :dataDepartment="aliasStore.aliasDepartment"
    />
    <div style="margin-top: 50px">
      <Modal
        :title="'Create Position'"
        :buttonName="'ADD POSITION'"
        @handle-ok="toggleModal(false)"
        @cancel="toggleModal(false)"
        @show-modal="toggleModal(false)"
        v-model:open="openPosition"
      >
        <template #slot_form>
          <Form @submit="submit" input-label="Position" :aliases="aliases" />
        </template>
      </Modal>
      <AliasTable
        style="margin-top: 0.5rem"
        :dataPosition="aliasStore.aliasPosition"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
// import
import { onMounted, ref } from "vue";
import { useAliasStore } from "@/stores/alias";
import Modal from "./Modal.vue";

// props & pinia
const {
  aliasStore,
  getAliasDepartment,
  getAliasPosition,
  setAliasDepartment,
  setAliasPosition,
} = useAliasStore();
const openPosition = ref<boolean>(false);
const openDepartment = ref<boolean>(false);
const aliases = ref({
  firstInput: "",
  secondInput: [],
});
// constants
// refs

// computed

// methods
const submit = async (event) => {
  const data = {
    alias: event.firstInput,
    origins: event.secondInput && event.secondInput,
  };

  if (event.formName === "Department") {
    await setAliasDepartment(data);
    toggleModal(true);
  }
  if (event.formName === "Position") {
    await setAliasPosition(data);
    toggleModal(false);
  }
};

// Modal methods
const toggleModal = (isDepartment) => {
  if (isDepartment) openDepartment.value = !openDepartment.value;
  else openPosition.value = !openPosition.value;
  clearForm();
};

const clearForm = () => {
  aliases.value.secondInput = [];
  aliases.value.firstInput = "";
};
// watch

// hooks
onMounted(async () => {
  await getAliasDepartment();
  await getAliasPosition();
});
</script>

<style scoped>
.loading {
  margin: 15rem 25rem;
  display: flex;
  justify-content: center;
}
</style>
