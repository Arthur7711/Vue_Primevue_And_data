<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import DisabledIncomplete from "../../icons/DisabledIncomplete.vue";
import DisabledInProgress from "../../icons/DisabledInProgress.vue";
import DisabledSuccess from "../../icons/DisabledSuccess.vue";
import { getStatus, addProjectMilesrone } from "../../../api/projects";
import useErrorStore from "../../../stores/messages";
import useProjectStore from "../../../stores/project";

const props = defineProps<{
  options: {
    value: string;
    id: string | number;
  }[];
}>();
const route = useRoute();
const visible = ref<boolean>(false);
const showModal = () => {
  visible.value = true;
};

const statuses = [
  {
    value: "incomplete",
    status: "Incomplete",
  },
  {
    value: "in_progress",
    status: "In progress",
  },
  {
    value: "complete",
    status: "Complete",
  },
];
const selectedStatus = ref(statuses[2]);
const createdMilestone = ref({
  milestone: "",
  date: "",
  comment: "",
  date_end: "",
});
const filterOption = (input: string, option: any) => {
  return option?.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const addMilestone = async () => {
  try {
    await addProjectMilesrone(`${route.params.project}`, {
      milestone_id: props.options?.find(
        (el) => el.value === createdMilestone.value.milestone
      )?.id,
      comment: createdMilestone.value.comment,
      date_start: dayjs(createdMilestone.value.date).format("YYYY-MM-DD"),
      date_end: dayjs(createdMilestone.value.date_end).format("YYYY-MM-DD"),
    }).then(() => {
      visible.value = false;
      useProjectStore.changeUpdateCount();
      createdMilestone.value = {
        milestone: "",
        date: "",
        comment: "",
        date_end: "",
      };
    });
  } catch (error) {
    useErrorStore.changeErrorText(error?.message || "unknown error");
  }
};
//dayjs(createdMilestone.date).format("YYYY-MM-DD")
watch(
  () => createdMilestone.value.date,
  async () => {
    if (createdMilestone.value.date) {
      try {
        const { data } = await getStatus(
          `${route.params.project}`,
          dayjs(createdMilestone.value.date).format("YYYY-MM-DD")
        );
        selectedStatus.value = statuses.find((el) => el.value === data);
      } catch (error) {
        useErrorStore.changeErrorText(error?.message || "unknown error");
      }
    }
  }
);
</script>
<template>
  <div>
    <button class="add-milestone" @click="showModal">Add milestone</button>
    <a-modal
      v-model:visible="visible"
      title="Add milestone"
      :footer="null"
      style="width: 400px"
      centered
      class="milestone-modal"
    >
      <a-select
        class="milestone-modal__select"
        show-search
        placeholder="Select or search milestone"
        style="width: 100%"
        v-model:value="createdMilestone.milestone"
        :options="options"
        :filter-option="filterOption"
      />
      <div class="milestone-modal__stasuses">
        <DisabledSuccess v-if="selectedStatus.value === 'complete'" />
        <DisabledInProgress
          v-else-if="selectedStatus.value === 'in_progress'"
        />
        <DisabledIncomplete v-else="selectedStatus.value === 'incomplete'" />
        <p>{{ selectedStatus.status }}</p>
      </div>
      <a-date-picker
        picker="month"
        v-model:value="createdMilestone.date"
        format="MMM, YYYY"
        placeholder="start date"
        :disabledDate="
          (current) => {
            return (
              current &&
              current.valueOf() >= dayjs(createdMilestone.date_end).valueOf()
            );
          }
        "
      />
      <a-date-picker
        picker="month"
        v-model:value="createdMilestone.date_end"
        format="MMM, YYYY"
        placeholder="end date"
        :disabledDate="
          (current) => {
            return (
              current &&
              current.valueOf() <= dayjs(createdMilestone.date).valueOf()
            );
          }
        "
      />
      <a-textarea
        v-model:value="createdMilestone.comment"
        placeholder="Comment"
        class="comment"
      />
      <button
        class="milestone-modal__save"
        :disabled="
          !createdMilestone.date &&
          !createdMilestone.milestone &&
          !createdMilestone.date_end
        "
        @click="addMilestone"
        :style="{
          background:
            !createdMilestone.date &&
            !createdMilestone.milestone &&
            !createdMilestone.date_end
              ? 'gray'
              : '#1860DC',
        }"
      >
        Save
      </button>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
.add-milestone {
  background: $primary-text-default;
  border: none;
  padding: 8px 16px 8px 16px;
  border-radius: 8px;
  gap: 4px;
  color: $neutrals-text-invert;
  font-weight: 600;
  position: absolute;
  top: 100px;
  right: 24px;
  cursor: pointer;
}
.milestone-modal {
  :global(.ant-modal-body) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &__stasuses {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid $neutrals-border-default;
    padding: 8px 12px 8px 12px;
    border-radius: 8px !important;
    height: 36px;
    p {
      margin: 0px;
      color: $neutrals-text-primary;
    }
  }
  &__save {
    border: none;
    height: 36px;
    border-radius: 8px;
    background: $primary-text-default;
    cursor: pointer;
    color: #fff;
  }
  &__save[disabled="true"] {
    background: red;
  }
}

:deep(.ant-select-selector) {
  padding: 8px 12px 8px 12px;
  border-radius: 8px !important;
  border: 1px solid $neutrals-border-default;
  gap: 6px;
  height: 36px !important;
}
:global(.ant-picker) {
  border-radius: 8px !important;
  height: 36px;
}
:global(.comment) {
  width: 100%;
  height: 120px !important;
  border-color: $neutrals-border-default;
  border-radius: 8px;
  vertical-align: text-top;
  resize: none;
}
</style>
