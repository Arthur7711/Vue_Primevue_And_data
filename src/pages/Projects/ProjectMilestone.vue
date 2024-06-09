<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import useProjectStore from "../../stores/project";
import MilestoneTable from "../../components/Projects/Milestone/MilestoneTable.vue";
import {
  getAllMilestones,
  getProjectMilesrone,
  getProjectMilesroneSummary,
  DeleteProjectMilesrone,
} from "../../api/projects";
import { useRoute } from "vue-router";
import CustomNonselectableSelect from "../../components/CustomNonselectableSelect.vue";
import AddMilestoneModal from "@/components/Projects/Milestone/AddMilestoneModal.vue";
import type { IMIlestones } from "../../api/models/IProjects";

const route = useRoute();
const defaultHeadcount = {
  man_mount: 0,
  offices: {
    sum: 0,
    options: [],
  },
  headcounts: {
    sum: 0,
    options: [],
  },
};
const makeUpdate = ref(0);
const tableValues = ref<IMIlestones[]>();
const options = ref<
  {
    value: string;
    id: string | number;
  }[]
>([]);
const showLoader = ref(true);
const headData = ref<{
  man_mount: number | string;
  offices: {
    sum: number;
    options: {
      value?: string | number;
      label: string | number;
    }[];
  };
  headcounts: {
    sum: number;
    options: {
      value: string | number;
      label: string | number;
    }[];
  };
}>(defaultHeadcount);

const callSummary = async () => {
  headData.value.man_mount = 0;
  headData.value.headcounts.sum = 0;
  headData.value.headcounts.options = [];
  headData.value.offices.sum = 0;
  headData.value.offices.options = [];
  if (useProjectStore.milestoneId.value) {
    const { data } = await getProjectMilesroneSummary(
      `${route.params.project}`,
      useProjectStore.milestoneId.value
    );
    headData.value.man_mount = data.total_man_month;
    headData.value.offices.options = Object.entries(
      data.headcount_by_offices
    )?.map((officeData) => {
      headData.value.offices.sum += officeData[1];
      return {
        label: officeData[0],
        value: officeData[1],
      };
    });
    headData.value.headcounts.options = Object.entries(
      data.headcount_by_departments
    )?.map((officeData) => {
      headData.value.headcounts.sum += officeData[1];
      return {
        label: officeData[0],
        value: officeData[1],
      };
    });
    makeUpdate.value++;
  }
};
const projectsCalls = async () => {
  try {
    getProjectMilesrone(`${route.params.project}`).then(({ data }) => {
      tableValues.value = data;
      showLoader.value = false;
    });
    getAllMilestones().then(({ data }) => {
      options.value = data.map((el) => {
        return { value: el.name, id: el.id };
      });
    });

    callSummary();
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  projectsCalls();
});
watch(
  () => useProjectStore.updateCount.value,
  () => {
    projectsCalls();
  }
);
watch(
  () => useProjectStore.milestoneId.value,
  async () => {
    await callSummary();
  }
);
</script>
<template>
  <div>
    <AddMilestoneModal
      v-if="
        options?.filter(
          (el) =>
            !tableValues?.find((elem) => elem?.milestone?.name === el?.value)
        ).length
      "
      :options="
        options?.filter(
          (el) =>
            !tableValues?.find((elem) => elem?.milestone?.name === el?.value)
        ) || options
      "
    />
    <ProjectTabs>
      <template #milestone>
        <div class="project-main">
          <div class="project-header">
            <div class="project-header__first">
              <h3>Milestones statistics</h3>
              <p>
                Selected milestone:
                <span>{{ useProjectStore.milestoneName.value }}</span>
              </p>
            </div>
            <div class="project-header__sec">
              <h3>Man month</h3>
              <p>{{ headData.man_mount }}</p>
            </div>
            <div class="project-header__doc">
              <CustomNonselectableSelect
                title="Offices"
                :value="headData.offices.options?.length"
                :options="headData.offices.options"
                :showCounts="false"
                :key="makeUpdate"
              />
            </div>
            <div class="project-header__doc">
              <CustomNonselectableSelect
                title="Total headcount"
                :value="headData.headcounts.sum"
                :options="headData.headcounts.options"
                :showCounts="true"
                :key="makeUpdate"
              />
            </div>
          </div>
          <div style="display: flex; justify-content: center">
            <a-spin tip="Loading..." size="large" v-if="showLoader" />
          </div>
          <MilestoneTable
            v-if="!showLoader"
            :item-list="tableValues"
            :options="
              options?.filter(
                (el) =>
                  !tableValues?.find(
                    (elem) => elem?.milestone?.name === el?.value
                  )
              ) || options
            "
          />
        </div>
      </template>
    </ProjectTabs>
  </div>
</template>

<style scoped lang="scss">
.project-main {
  border: 1px solid $neutrals-border-default;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .project-header {
    display: grid;
    grid-template-columns: 6fr 2fr 2fr 2fr;
    border-bottom: 1px solid $neutrals-border-default;
    div {
      padding: 10px 20px;
    }
    &__first {
      border-right: 1px solid $neutrals-border-default;
      display: flex;
      flex-direction: column;
      gap: 4px;
      h3 {
        border: none;
        color: $neutrals-text-secondary;
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
      }
      p {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: $neutrals-text-secondary;
        display: flex;
        align-items: center;
        gap: 4px;
        span {
          color: $neutrals-text-primary;
        }
      }
    }
    &__sec {
      border-right: 1px solid $neutrals-border-default;
      display: flex;
      flex-direction: column;
      gap: 4px;
      h3 {
        color: $neutrals-text-secondary;
        font-size: 14px;
        line-height: 20px;
        border: none;
      }
      p {
        color: $neutrals-text-primary;
        font-family: Source Sans 3;
        font-size: 22px;
        font-weight: 700;
        line-height: 24px;
      }
    }
    &__doc {
      border-right: 1px solid $neutrals-border-default;
    }
  }
}
</style>
