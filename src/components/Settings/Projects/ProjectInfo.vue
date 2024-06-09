<script lang="ts" setup>
import CustomBreadcrumbs from "../../CustomBreadcrumbs.vue";
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Button from "../../Custom/components/Button/Button.vue";
import IconArrowRight24px from "../../icons/IconArrowRight24px.vue";
import IconArchive from "../../icons/IconArchive.vue";
import Chips from "primevue/chips";
import Dialog from "../../Custom/Dialog.vue";
import { onMounted } from "vue";
import {
  getProjectInSetting,
  putProjectInSetting,
  type IProjectList,
  getProjectList,
  postMergeProjects,
  postArchiveProject,
} from "@/api/settingProjects";
import { useRoute } from "vue-router";
import Notification from "@/components/Custom/components/Notification.vue";
import router from "@/router";
const statuses = [
  { id: 0, title: "Active" },
  { id: 1, title: "Completed" },
];
const isOpenMargeDialog = ref(false);
const projectInfo = ref<IProjectList | null>(null);
const aliases = ref<string[]>([]);
const projInfoChanged = ref(false);
const name = ref("");
const status = ref("");
const mergeWithProject = ref<IProjectList | null>(null);

const mergeContent = (proj: string) => {
  return `Are you sure you want to merge this project with ${proj}? <p class='merge_content_archive_warn'>When merged, the ${projectInfo.value?.name} project will be archived</p>`;
};
const route = useRoute();
const notifOptions = ref({
  show: false,
  value: "",
  type: "normal",
});
const projects = ref<IProjectList[] | null>(null);
const pushTo = `settings?tab=3${
  route?.query?.search_query
    ? "&search_query=" + route?.query?.search_query
    : ""
}${
  route?.query?.selected_status
    ? "&selected_status=" + route?.query?.selected_status
    : ""
}`;
const handleGetProjectInfo = async () => {
  await getProjectInSetting(+route.params!.id).then((res) => {
    projectInfo.value = res.data.data;
    name.value = projectInfo.value.name;
    status.value = projectInfo.value.status;
    aliases.value = projectInfo.value?.alias?.length
      ? projectInfo.value.alias?.map((el) => el.project_name_origin)
      : [];
  });
};
const handleSaveProjectInfo = async (
  name: string,
  status: string,
  alias?: string[]
) => {
  await putProjectInSetting(+route.params.id, name, status, alias)
    .then((res) => {
      aliases.value = res.data.alias.map((el) => el.project_name_origin);
      notifOptions.value.show = true;
      notifOptions.value.value = "Project editted";
      notifOptions.value.type = "normal";
      projInfoChanged.value = false;
    })
    .catch((err) => {
      notifOptions.value.show = true;
      notifOptions.value.value = "Failed to edit";
      notifOptions.value.type = "warning";
    });
};
const handleGetProjects = async () => {
  getProjectList().then((res) => {
    projects.value = res.data.data.filter(
      (el) => el.id !== projectInfo?.value?.id
    );
  });
};
const handleMergeProject = async () => {
  if (projectInfo.value?.id && mergeWithProject.value?.id) {
    const response = await postMergeProjects(
      projectInfo.value.id,
      mergeWithProject.value.id
    );
    if (response.status < 400) {
      notifOptions.value.show = true;
      notifOptions.value.value = "Project merged";
      notifOptions.value.type = "normal";
      setTimeout(() => {
        router.push(`/${pushTo}`);
      }, 1000);
    } else {
      notifOptions.value.show = true;
      notifOptions.value.value = "Failed to merge";
      notifOptions.value.type = "warning";
    }
  }
};
onMounted(async () => {
  await handleGetProjectInfo().then(async () => handleGetProjects());
  const el = document.querySelector(".p-chips-input-token > input");
  el &&
    el.addEventListener("blur", (e: any) => {
      if (e.target.value) {
        aliases.value = aliases.value
          ? [...aliases.value, e.target.value]
          : [e.target.value];
        e.target.value = "";
        projInfoChanged.value = true;
      }
    });
});
</script>

<template>
  <Dialog
    :content="mergeContent(mergeWithProject?.name ? mergeWithProject.name : '')"
    v-model="isOpenMargeDialog"
    title="Merge project"
    approvedButtonName="Merge project"
    @submitted="() => handleMergeProject()"
    :close-on-submit="true"
  />
  <div v-if="projectInfo" class="page-template">
    <CustomBreadcrumbs
      :push-to="pushTo"
      :breadcrumbs="['Setting', projectInfo.name]"
      style="margin-top: 70px"
    />
    <h1>{{ projectInfo.name }}</h1>
    <div class="project-info-content">
      <div class="project-info">
        <h4>Project Info</h4>
        <form class="form">
          <div class="form-item">
            <label for="name">Project name *</label>
            <InputText
              class="form-item__input"
              id="name"
              @input="projInfoChanged = true"
              v-model="name"
              placeholder="Project name"
            />
          </div>
          <div class="form-item">
            <label>Status *</label>
            <Dropdown
              :dropTypes="statuses"
              :default-index="
                projectInfo.status
                  ? statuses.findIndex(
                      (el) =>
                        el.title.toLocaleLowerCase() ===
                        projectInfo!.status.toLocaleLowerCase()
                    )
                  : undefined
              "
              :option-label="'title'"
              @change-event="
                (val: any) => {
                  if (
                    !status ||
                    status.toLocaleLowerCase() !==
                      val?.title.toLocaleLowerCase()
                  ) {
                    projInfoChanged = true;
                  }
                  status = val?.title ? val.title : val;
                }
              "
            />
          </div>
          <div class="form-item">
            <label>Alias</label>
            <Chips
              @add="projInfoChanged = true"
              @remove="projInfoChanged = true"
              :class="
                aliases && aliases?.length > 3
                  ? 'form-item--chips'
                  : 'form-item--chips_empty'
              "
              v-model="aliases"
              id="name"
            >
              <template #chip="{ value }"
                ><span class="project_info_chips_value">{{
                  value
                }}</span></template
              >
              <template #removetokenicon="scope">
                <div
                  @click="scope.onClick"
                  class="project_info_chips_remove_token"
                >
                  <RemoveIcon />
                </div>
              </template>
            </Chips>
          </div>
          <div class="form-item-button">
            <Button
              :disable="!name || !status || !projInfoChanged"
              @click="
                async () => {
                  await handleSaveProjectInfo(
                    name,
                    status,
                    aliases?.length ? aliases : []
                  );
                }
              "
            >
              <template #content> Save info </template>
            </Button>
          </div>
        </form>
      </div>
      <div class="project-info">
        <h4>Merge project</h4>
        <section class="merge">
          <div class="merge-selects">
            <div class="merge-selects__item">
              <label>Current project</label>
              <Dropdown
                dropPInfo="265px"
                :disabled="true"
                :placeholder="`${route.query?.name}`"
              />
            </div>
            <IconArrowRight24px style="margin-top: 25px" />
            <div class="merge-selects__item">
              <label>New project</label>
              <Dropdown
                dropPInfo="265px"
                :dropTypes="projects"
                :option-label="'name'"
                show-clear
                :placeholder="'Select project for merge'"
                @change-event="(val: IProjectList) => mergeWithProject = val"
              />
            </div>
          </div>
          <div class="form-item-button">
            <Button
              :disable="!mergeWithProject"
              @click="isOpenMargeDialog = true"
            >
              <template #content> Merge project </template>
            </Button>
          </div>
        </section>
      </div>
    </div>
  </div>
  <Notification
    :type="(notifOptions.type as 'warning' | 'normal')"
    @show="(val) => (notifOptions.show = val)"
    :visible="notifOptions.show"
    >{{ notifOptions.value }}</Notification
  >
</template>

<style lang="scss">
.page-template {
  background-color: $neutrals-background-default;
  min-height: 120vh;
  padding-bottom: 20vh;
  width: 100vw;
  margin-left: -24px;
  padding-left: 24px;
  padding-top: 16px;
}
.project-info {
  width: 610px;
  background-color: #fff;
  border: 1px $neutrals-border-default solid;
  border-radius: 12px;
  padding: 10px 0px 12px 0px;
  margin-bottom: 20px;
  h4,
  .archive-content {
    margin-left: 24px;
    font-size: 16px;
    font-weight: 600;
  }
  .archive-content {
    margin-bottom: 12px;
  }
}
.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 0px 24px 0px 24px;
  &__input {
    height: 36px;
    border-radius: 8px;
  }
  &--chips,
  &--chips_empty {
    .p-inputtext {
      border-radius: 8px;
    }
    .p-chips-token {
      height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: none;
      border: 1px #cfd5dd solid;
      font-size: 12px;
      border-radius: 4px;
      svg {
        width: 8px;
        height: 8px;
      }
    }
    .p-chips-multiple-container {
      min-height: 36px;
      width: 100%;
      display: flex;
      align-items: center !important;
      justify-content: start;
      gap: 3px;
    }
    .p-chips-input-token {
      height: 36px;
    }
  }
  &--chips {
    .p-chips-multiple-container {
      padding: 10px;
    }
  }
  &--chips_empty {
    .p-chips-multiple-container {
      padding: 0 10px 0 10px;
    }
  }
  &label {
    @include Body-M;
    color: $neutrals-text-secondary;
  }
}
.project-info-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form-item-button {
  display: flex;
  flex-direction: column;
  padding: 12px 24px 0px 24px;
  border-top: 1px $neutrals-border-default solid;
}
.merge-selects {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 24px 12px 24px;
  &__item {
    & label {
      @include Body-M;
      color: $neutrals-text-secondary;
    }
  }
}
.project_info_chips_remove_token {
  margin-left: 8px;
}
.project_info_chips_value {
  font-size: 12px;
  font-weight: 400;
  color: #162031;
}
.archive-content {
  @include Body-L;
  color: $neutrals-text-secondary;
}
.preserve-newline {
  white-space: pre-line;
}
.merge_content_archive_warn {
  color: $neutrals-text-hint;
  font-weight: 600;
}
</style>
