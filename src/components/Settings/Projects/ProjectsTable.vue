<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "primevue/api";
import { ref, onMounted, watch } from "vue";
import { debouncedWatch } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import IconSearch from "@/components/icons/IconSearch.vue";
import Button from "../../Custom/components/Button/Button.vue";
import InputText from "primevue/inputtext";
import { type IProjectList, postCreateProject } from "@/api/settingProjects";
import useUserStore from "@/stores/user";
import Dialog from "@/components/Custom/Dialog.vue";

defineProps<{
  data: IProjectList[];
}>();

const route = useRoute();
const router = useRouter();

const emit = defineEmits<{
  (e: "update-page", value: number): void;
  (e: "update-table", value?: { search?: string; status?: string }): void;
}>();

const tableSearchQuery = ref("");
const tableSelectedStatus = ref("");
const saveError = ref("");
const notifOptions = ref({
  show: false,
  value: "",
  type: "normal",
});
const page = ref(1);
const selectedItem = ref();
const isOpen = ref(false);
const newProject = ref<{ name: string; status: string }>({
  name: "",
  status: "",
});
const handleCreateProject = async () => {
  await postCreateProject(
    newProject.value.name,
    newProject.value.status.toLocaleLowerCase()
  )
    .then(() => {
      isOpen.value = false;
      notifOptions.value.show = true;
      notifOptions.value.value = `Project ${newProject.value.name} created`;
      notifOptions.value.type = "normal";
      newProject.value = { name: "", status: "" };
      saveError.value = "";
      emit("update-table");
    })
    .catch((err) => {
      if (err.cause?.message) {
        saveError.value = err.cause.message.data.error_message;
      }
    });
};
const statuses = [
  { id: 0, title: "Completed" },
  { id: 1, title: "Active" },
];
watch(
  () => route.query,
  () => {
    page.value = 1;
  },
  { deep: true }
);

watch(
  () => page.value,
  () => {
    emit("update-page", page.value);
  }
);

watch(
  () => selectedItem.value,
  () => {
    if (
      useUserStore.self.value &&
      !useUserStore.self.value.assigned_roles.includes("viewer")
    ) {
      router.push(
        `settings_projects/${selectedItem.value.id}?name=${
          selectedItem.value.name
        }${
          tableSearchQuery.value
            ? "&search_query=" + tableSearchQuery.value
            : ""
        }${
          tableSelectedStatus.value
            ? "&selected_status=" + tableSelectedStatus.value
            : ""
        }`
      );
    }
  }
);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  filtersFiller();
});

debouncedWatch(
  () => [tableSearchQuery.value, tableSelectedStatus.value],
  () => {
    emit("update-table", {
      search: tableSearchQuery.value,
      status: tableSelectedStatus.value,
    });
    router.push(
      `settings?tab=3${
        tableSearchQuery.value ? "&search_query=" + tableSearchQuery.value : ""
      }${
        tableSelectedStatus.value
          ? "&selected_status=" + tableSelectedStatus.value
          : ""
      }`
    );
  },
  { debounce: 300 }
);
const filtersFiller = () => {
  tableSearchQuery.value = route?.query?.search_query
    ? (route?.query?.search_query as string)
    : "";
  tableSelectedStatus.value = route?.query?.selected_status
    ? (route?.query?.selected_status as string)
    : "";
};
const dropdownDefaultIndex = (): number | undefined => {
  return route.query.selected_status
    ? statuses.filter((el) => el.title === route.query.selected_status)[0].id
    : undefined;
};
const customVH = (value: number) => {
  return `${(screen.height / 100) * value}px`;
};
watch(isOpen, () => {
  if (isOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
});
</script>

<template>
  <div class="card">
    <Dialog
      v-model="isOpen"
      :title="'Add project'"
      :disable-submit-button="
        !(newProject.name.length && newProject.status.length)
      "
      @submitted="() => handleCreateProject()"
      :approved-button-name="'Add project'"
      :button-color-schema="'primary'"
    >
      <template #form>
        <form
          class="project_table_form"
          @submit.prevent="
            (e) => {
              if (newProject.name.length && newProject.status.length) {
                handleCreateProject();
              }
            }
          "
        >
          <div class="project_table_form-item">
            <label for="name">Project name *</label>
            <InputText
              class="project_table_form-item__input"
              :class="
                saveError
                  ? 'project_table_form-item__input project_table_form-item__input--error'
                  : 'project_table_form-item__input'
              "
              id="name"
              v-model="newProject.name"
              @input="
                () => {
                  if (saveError) {
                    saveError = '';
                  }
                }
              "
              placeholder="Text project name"
            />
            <div class="project_table_form-item--error" v-if="saveError">
              <RedAlertTriangle style="width: 1rem; height: 1rem" />{{
                saveError
              }}
            </div>
          </div>
          <div class="project_table_form-item">
            <label>Status *</label>
            <Dropdown
              :dropTypes="statuses.filter((el) => el.id !== null)"
              :option-label="'title'"
              :default-index="1"
              @change-event="(val: any) => (newProject.status = val.title)"
            />
          </div>
        </form>
      </template>
    </Dialog>
    <div class="table-header">
      <div class="table-header__inputs">
        <span class="p-input-icon-left">
          <IconSearch />
          <InputText
            style="height: 36px"
            v-model="tableSearchQuery"
            placeholder="Search projects"
            size="small"
          />
        </span>
        <Dropdown
          style="width: 320px; background-color: white"
          :placeholder="'Project status'"
          show-clear
          :dropTypes="statuses"
          :default-index="dropdownDefaultIndex()"
          :optionLabel="'title'"
          @change-event="
            (val:any) => {
              tableSelectedStatus = val?.title ? val.title : null;
            }
          "
        />
      </div>
      <Button
        v-if="
          useUserStore.self.value &&
          !useUserStore.self.value.assigned_roles.includes('viewer')
        "
        type="submit"
        @click="isOpen = !isOpen"
      >
        <template #content> Add Project </template>
      </Button>
    </div>
    <DataTable
      v-model:filters="filters"
      :value="data"
      :table-class="'project_table_table'"
      showGridlines
      removableSort
      sortField="sumMM"
      :sortOrder="-1"
      v-model:selection="selectedItem"
      selectionMode="single"
    >
      <Column
        v-if="data"
        field="name"
        header="Project"
        :header-class="'headerheader'"
        sortable
        style="width: 20%"
      >
      </Column>
      <Column v-if="data" field="alias" header="Alias" style="width: 70%">
        <template #body="{ data }">
          <div v-if="data?.alias?.length">
            <span v-for="alias of data?.alias">{{
              alias?.project_name_origin
                ? alias?.project_name_origin + " "
                : "-"
            }}</span>
          </div>
          <div v-else>
            <span>-</span>
          </div>
        </template>
      </Column>
      <Column v-if="data" field="status" header="Status" style="width: 10%">
        <template #body="{ data }">
          <div
            :class="
              data?.status
                ? data?.status?.toLocaleLowerCase() === 'active'
                  ? 'projecttable_column_status_active'
                  : 'projecttable_column_status_completed'
                : ''
            "
          >
            {{ data?.status ? data?.status : "-" }}
          </div></template
        >
      </Column>
    </DataTable>
    <Notification
      :type="(notifOptions.type as 'warning' | 'normal')"
      @show="(val) => (notifOptions.show = val)"
      :visible="notifOptions.show"
      >{{ notifOptions.value }}</Notification
    >
  </div>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
:deep(table) {
  border-radius: 8px;
  overflow: hidden;
  border: 1px black solid;
}
:deep(.p-datatable-wrapper) {
  border-radius: 8px;
  border: 2px $neutrals-border-default solid;
  padding: 0 !important;
}

:deep(.p-datatable-thead) {
  top: -1px !important;
  tr {
    max-height: 30px !important;
    overflow: hidden !important;
    th {
      max-height: 30px !important;
      overflow: hidden !important;
      padding: 10px 1rem !important;
    }
  }
}

:deep(.p-datatable) {
  border: none;
  overflow: hidden;
  // border-collapse: collapse;
}

::v-deep(.p-datatable.p-datatable-gridlines .p-datatable-thead > tr > th) {
  @include Body-S-12-Bold;
  background: $neutrals-background-weak;
  color: $neutrals-text-secondary;
}

::v-deep(.p-datatable .p-sortable-column .p-sortable-column-icon) {
  height: 13px;
  margin-left: 0.2rem;
  color: $neutrals-icon-secondary;
}

::v-deep(.p-input-icon-left > .p-inputtext) {
  height: 2.25rem;
  width: 453px;
  border-radius: 8px;
  box-shadow: none !important;
  &::placeholder {
    color: $neutrals-text-hint;
  }
}

.projecttable_column_status_active {
  border-radius: 100px;
  padding: 2px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $positive-background-weak;
  width: min-content;
}
.projecttable_column_status_completed {
  border-radius: 100px;
  padding: 2px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $neutrals-background-semi;
  width: min-content;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  &__inputs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }
}
.project_table_form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;
  .project_table_form-item {
    display: flex;
    flex-direction: column;
    &__input {
      height: 36px;
      border-radius: 8px;
      padding-left: 10px;
      &::placeholder {
        color: $neutrals-text-hint;
      }
    }
    &__input--error {
      border-color: $danger-background-default;
      border-width: 2px;
    }
    &--error {
      display: flex;
      align-items: center;
      color: $danger-background-default;
      font-size: 12px;
      font-weight: 400;
    }
    label {
      @include Body-M;
      color: $neutrals-text-secondary;
    }
  }
}
</style>
