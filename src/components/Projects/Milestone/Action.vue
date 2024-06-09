<script setup lang="ts">
import Actions from "../../icons/Actions.vue";
import TrashIcon from "../../icons/TrashIcon.vue";
import EditMilestoneModal from "./EditMilestoneModal.vue";
import { DeleteProjectMilesrone } from "../../../api/projects";
import { useRoute } from "vue-router";
import useErrorStore from "../../../stores/messages";
import useProjectStore from "../../../stores/project";

const props = defineProps<{
  options: {
    value: string;
    id: string | number;
  }[];
  id: string | number;
  date_start: string;
  date_end: string;
  name: string;
  comment: string;
}>();
const route = useRoute();

const deleteRow = async () => {
  try {
    await DeleteProjectMilesrone(`${route.params.project}`, `${props.id}`);
    useErrorStore.changeSuccessText("Milestone successfully deleted");
    useProjectStore.changeUpdateCount();
  } catch (error) {
    useErrorStore.changeErrorText(error?.message || "unknown error");
  }
};
</script>
<template>
  <a-dropdown>
    <a class="ant-dropdown-link" @click.prevent>
      <Actions />
    </a>
    <template #overlay>
      <a-menu>
        <a-menu-item>
          <EditMilestoneModal
            :options="options"
            :id="id"
            :date_start="date_start"
            :date_end="date_end"
            :name="name"
            :comment="comment"
          />
        </a-menu-item>
        <a-menu-item>
          <div
            style="display: flex; align-items: center; gap: 6px"
            @click="deleteRow"
          >
            <TrashIcon /> <span style="color: #c9332c">Удалить</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<style scoped></style>
