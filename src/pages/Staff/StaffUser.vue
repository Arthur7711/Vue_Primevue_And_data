<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import StaffProjectHistoryTable from "@/components/Staff/StaffProjectHistoryTable.vue";
import { LinkIcon, TagOutlineIcon } from "mdi-vue3";
import CustomTag from "@/components/CustomTag.vue";
import UserStaffLoadChart from "@/components/Staff/StaffUserCharts/UserStaffLoadChart/UserStaffLoadChart.vue";
import IconUserCircle from "@/components/icons/IconUserCircle.vue";
import IconDataFlow from "@/components/icons/IconDataFlow.vue";
import { onMounted } from "vue";
import { getStafItem, getStaffChart, getStaffStatics } from "../../api/staff";
import type { IUserStaff } from "../../api/models/IStaff";
import dayjs from "dayjs";
import { analysticChartProjects } from "@/api/charts";
import { watch, computed } from "vue";
import { generateColors } from "@/assets/scss/chartColors";

const route = useRoute();
const url = import.meta.env.VITE_APP_URL_START;

interface IHR {
  icon: string;
  content: string;
  value: string | string[];
}
const data: IHR[] = [
  {
    icon: "link",
    content: "Vacancy",
    value: "",
  },
  {
    icon: "link",
    content: "Video of the interview",
    value: "",
  },
  { icon: "link", content: "Resume", value: "" },
  {
    icon: "tag",
    content: "Skills",
    value: [],
  },
  {
    icon: "tag",
    content: "Complete Saber courses",
    value: [],
  },
];
const userStaff = ref<IUserStaff | null>(null);
const activeKey = ref("1");
const statics = ref({
  last_projects: [],
  last_employment_rate: 0,
});
const colors = ref();
const datePeriod = ref([
  dayjs().subtract(1, "month"),
  dayjs().subtract(0, "month"),
]);
const lineChartData = ref();
const jiraLineChart = ref();
const datePerioudChange = async () => {
  if (datePeriod.value) {
    const chartProjects = await analysticChartProjects({
      date_from: dayjs(datePeriod.value[0]).format("YYYY-MM-DD"),
      date_to: dayjs(datePeriod.value[1]).format("YYYY-MM-DD"),
    });
    lineChartData.value = chartProjects.data;
    colors.value = generateColors();
    const { data } = await getStaffChart(
      `${route.params.id}`,
      dayjs(datePeriod.value[0]).format("YYYY-MM-DD"),
      dayjs(datePeriod.value[1]).format("YYYY-MM-DD")
    );
    const jiraTasksArray = Object.entries(data);
    jiraLineChart.value = {
      labels: jiraTasksArray.map((el) => el[0]),
      datasets: [
        {
          label: "",
          data: jiraTasksArray.map((el) => el[1]),
        },
      ],
    };
  }
};
onMounted(async () => {
  const { data } = await getStafItem(`${route.params.id}`);
  userStaff.value = data;
  const staticData = await getStaffStatics(`${route.params.id}`);
  statics.value = staticData.data;
  datePerioudChange();
});

watch(datePeriod, async () => {
  datePerioudChange()
});
const chartData = computed(() => {
  let quantity = 0;
  const transformedData = lineChartData.value?.reduce(
    (result, item) => {
      result.labels.push(item.date);

      item?.projects?.forEach((project) => {
        const existingProject = result.datasets.find(
          (p) => p.label === project.name
        );
        if (existingProject) {
          existingProject.data.push(project.mm);
        } else {
          result.datasets.push({
            label: project?.name,
            backgroundColor: colors.value.backgroundColors[quantity],
            borderColor: colors.value.borderColors[quantity],
            fill: "stack",
            data: [project.mm],
          });
        }
        quantity++;
      });

      return result;
    },
    { labels: [], datasets: [] }
  );
  return transformedData;
});
</script>
<template>
  <CustomBreadcrumbs :breadcrumbs="['Staff', userStaff?.displayname]" />
  <div class="user">
    <div class="user__title">
      <h1 class="user__title__name">{{ userStaff?.displayname }}</h1>
      <a-avatar size="large" :src="userStaff?.avatar_url" />
    </div>
    <div class="user__start">
      <div class="user__start__profile">
        <IconUserCircle style="margin-right: 5px" />
        <a
          target="_blank"
          :href="url + `/#/staff/user/${userStaff?.samaccountname}`"
          >Start profile</a
        >
      </div>
      <div style="display: flex; align-items: center">
        <IconDataFlow style="margin-right: 5px" />
        <a
          target="_blank"
          :href="
            url +
            `/#/staff/tree?userId=${userStaff?.id}&headId=${userStaff?.head?.id}`
          "
          >Start structure</a
        >
      </div>
    </div>
  </div>
  <section>
    <a-row :gutter="[16, 16]" :wrap="false">
      <a-col class="card-group" :sapn="6">
        <a-card class="card-group__item">
          <p>Current project</p>
          <div class="projects" v-if="statics.last_projects.length">
            <div
              class="container"
              v-for="item of statics.last_projects?.slice(0, 2)"
            >
              {{ item }}
            </div>
            <div class="container" v-if="statics.last_projects?.length > 2">
              +{{ statics.last_projects?.length - 2 }}
            </div>
          </div>
          <div v-else>No Data</div>
        </a-card>
        <a-card class="card-group__item">
          <p>Current load (MM)</p>
          <p style="color: #162138; font-weight: 600">
            {{ statics.last_employment_rate }}
          </p>
        </a-card>
      </a-col>
      <a-col class="card-group" :sapn="6">
        <a-card class="card-group__item">
          <p>Title</p>
          <div>{{ userStaff?.title || "No data" }}</div>
        </a-card>
        <a-card class="card-group__item">
          <p>Studio</p>
          <router-link
            :to="{
              name: 'StudiosProjects',
              params: { studios: `${userStaff?.studio?.id}` },
            }"
            style="color: #1860dc; font-weight: 600"
          >
            {{ userStaff?.studio?.name || "No data" }}
          </router-link>
        </a-card>
        <a-card class="card-group__item">
          <p>Office</p>
          <div>{{ userStaff?.office?.name || "No data" }}</div>
        </a-card>
        <a-card class="card-group__item">
          <p>Head</p>
          <div>{{ userStaff?.head?.displayname || "No data" }}</div>
        </a-card>
      </a-col>
      <a-col class="card-group" :sapn="6">
        <a-card class="card-group__item">
          <p>Hire</p>
          <div>
            {{
              userStaff?.created_at
                ? dayjs(userStaff?.created_at).format("DD MMMM,YYYY")
                : "No data"
            }}
          </div>
        </a-card>
        <a-card class="card-group__item">
          <p>Fire</p>
          <div>
            {{
              userStaff?.fire_date
                ? dayjs(userStaff?.fire_date).format("DD MMMM,YYYY")
                : "Not fired"
            }}
          </div>
        </a-card>
      </a-col>
    </a-row>
  </section>
  <section class="staff">
    <section class="staff__info">
      <div class="staff__info-project-history">
        <div class="staff__info-project-history__title">Project history</div>
        <div class="staff__info-project-history__table">
          <StaffProjectHistoryTable />
        </div>
      </div>
      <div class="staff__info-hr">
        <div class="staff__info-hr__title">HR</div>
        <a-list bordered :data-source="data">
          <template #renderItem="{ item }">
            <a-list-item class="staff__info-hr-list" style="">
              <div style="display: flex; align-items: center">
                <LinkIcon
                  class="staff__info-hr-list__icon"
                  v-if="item.icon === 'link'"
                  style="transform: rotate(135deg)"
                />
                <TagOutlineIcon
                  class="staff__info-hr-list__icon"
                  v-else-if="item.icon === 'tag'"
                />
                <div class="staff__info-hr__content">{{ item.content }}</div>
              </div>
              <router-link
                to=""
                v-if="typeof item.value === 'string'"
                class="staff__info-hr-list__value"
                >{{ item.value }}</router-link
              >
              <div class="staff__info-hr-list__tag" v-else>
                <CustomTag v-for="value in item.value" type="neutral">{{
                  value
                }}</CustomTag>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </section>
    <section class="staff__charts">
      <div class="card-container" style="position: relative">
        <a-range-picker
          v-model:value="datePeriod"
          picker="month"
          :format="'MMM,YYYY'"
          style="position: absolute; top: 50px"
        />
        <a-tabs v-model:activeKey="activeKey" type="card" style="padding-top: ">
          <a-tab-pane key="1" tab="Staff load">
            <UserStaffLoadChart :chartData="chartData" v-if="chartData" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="Attendance">
            <UserAttendanceChart
              :chart-data="jiraLineChart"
              v-if="jiraLineChart"
            />
          </a-tab-pane>
          <a-tab-pane key="3" tab="Jira tasks">
            <UserJiraTasksChart
              :chart-data="jiraLineChart"
              v-if="jiraLineChart"
            />
          </a-tab-pane>
        </a-tabs>
        <div v-if="!datePeriod" class="no_date">Please select Date</div>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  &__title {
    display: flex;
    align-items: center;
    &__name {
      @include Page-Title;
      margin-bottom: 10px;
      margin-right: 5px;
    }
  }
  &__start {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__profile {
      display: flex;
      align-items: center;
      margin-right: 5px;
    }
  }
}
.card-container {
  position: relative;
  .no_date {
    position: absolute;
    top: 150px;
    font-size: 20px;
    left: 100px;
  }
}
.card-container > .ant-tabs-card {
  width: 100%;
  height: 100vh;
}
.page-title {
  margin-bottom: 10px;
  margin-right: 5px;
}
.card-group {
  display: flex;
  &__item {
    width: 230px;
    @include Body-M-14-Regular;
    color: $neutrals-text-secondary;
    border-radius: 8px;
    & div {
      @include Body-M-14-Bold;
      color: $neutrals-text-secondary;
    }
    .projects {
      display: flex;
      align-items: center;
      gap: 4px;
      .container {
        border: 1px solid $neutrals-border-default;
        color: #1860dc;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
      }
    }
  }
}
.ant-list-item {
  justify-content: flex-start;
}
.staff {
  display: flex;
  margin-top: 40px;
  max-width: 100%;
  max-height: 69vh;
  &__info {
    min-width: 475px;
    min-height: 306px;
  }

  &__info-project-history {
    max-height: 342px;
    border: 1px solid $neutrals-border-default;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    &__title {
      height: 36px;
      padding: 8px 12px;

      background-color: $neutrals-background-weak;
      color: $neutrals-text-hint;
      @include Body-M-14-Bold;
    }
  }
  &__info-hr {
    height: 216px;
    margin-top: 20px;
    &__title {
      border: 1px solid $neutrals-border-default;
      height: 36px;
      padding: 8px 12px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background-color: $neutrals-background-weak;
      color: $neutrals-text-hint;
      @include Body-M-14-Bold;
    }
  }
  &__info-hr-list {
    display: flex;
    justify-content: space-between;
    &__icon {
      display: inline-block;
      flex: none;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    &__content {
      justify-content: flex-start;
      display: inline-block;
      width: 136px;
      white-space: nowrap;
      margin-inline-end: 6.25rem;
    }
    &__value {
      cursor: pointer;
      padding: 0 7px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      width: 12.5rem;
    }
    &__tag {
      text-align: left;
      width: 12.5rem;
    }
  }
  &__charts {
    width: 1500px;
    margin-left: 50px;
  }
}
:global(.ant-picker, .ant-picker-focused) {
  border: none;
  box-shadow: none;
}
:global(.ant-picker-active-bar) {
  display: none;
}
</style>
