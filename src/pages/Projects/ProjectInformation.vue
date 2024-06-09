<template>
  <ProjectTabs>
    <template #information>
      <section class="projects-info-page">
        <div class="projects-info-page__block">
          <div class="projects-info-page__block-header">Info</div>
          <div class="projects-info-page__block-content grid_col-3">
            <ProjectInformationBlockItem
              v-for="(item, name) in infoFields"
              v-model="item.value"
              :key="name"
              :item-props="item"
              :page-loading="pageLoading.info"
            />
          </div>
        </div>
        <div class="projects-info-page__horizontal-pair">
          <div class="projects-info-page__block">
            <div class="projects-info-page__block-header">Statistics</div>
            <div class="projects-info-page__block-content grid_col-3">
              <ProjectInformationBlockItem
                v-model="projectStatistic.total_man_month"
                :item-props="{
                  placeholder: 'No data',
                  inputType: 'statistic',
                  title: 'Total MM'
                }"
                big-letters
                :page-loading="pageLoading.statistic"
              />
              <ProjectInformationBlockItem
                v-model="projectStatistic.offices"
                :item-props="{
                  placeholder: 'No data',
                  inputType: 'statistic',
                  title: 'Offices'
                }"
                big-letters
                :page-loading="pageLoading.statistic"
              />
              <ProjectInformationBlockItem
                v-model="projectStatistic.headcount_by_departments"
                :item-props="{
                  placeholder: 'No data',
                  inputType: 'statistic',
                  title: 'Total Headcount'
                }"
                big-letters
                :page-loading="pageLoading.statistic"
              />
            </div>
            <div class="projects-info-page__block-header projects-info-page__block-header_sub-header">
              <span>Task tracker</span>
              <span>Version control</span>
            </div>
            <div class="projects-info-page__block-content grid_col-2">
              <ProjectInformationBlockItem
                v-for="(item, name) in taskTracker"
                v-model="item.value"
                :key="name"
                :item-props="item"
                :page-loading="pageLoading.jira"
                @jira-link-save="handleJiraLinkSave"
              />
              <div class="gap"/>
            </div>
          </div>
          <div class="projects-info-page__block">
            <div class="projects-info-page__block-header">Contacts</div>
            <div class="projects-info-page__block-header projects-info-page__block-header_sub-header">
              Mail
            </div>
            <div class="projects-info-page__block-content">
              <ProjectInformationBlockItem
                v-for="(item, name) in mailContacts"
                :key="name"
                v-model="item.value"
                :item-props="item"
                :page-loading="pageLoading.info"
              />
            </div>
            <div class="projects-info-page__block-header projects-info-page__block-header_sub-header">
              People
            </div>
            <div class="projects-info-page__block-content">
              <ProjectInformationBlockItem
                v-for="(item, name) in peopleContacts"
                :key="name"
                v-model="item.value"
                :item-props="item"
                :page-loading="pageLoading.info && pageLoading.people"
                :options="listWithAvatars"
              />
            </div>
          </div>
        </div>
      </section>
    </template>
  </ProjectTabs>
</template>

<script lang="ts" setup>
// import
import {onMounted, ref} from 'vue'
import {getProjectInfo, getProjectJira, getProjectStatistic, putProjectJira,} from '@/api/projects'
import {getStaffListWithAvatars} from '@/api/staff'
import {useRoute} from 'vue-router'
import dayjs from 'dayjs'
import projectStore from '@/stores/project'
import {getDeepValueByPath, snakeToCamel} from '@/utils'
import {INFO_FIELDS, TASK_TRACKER, PROJECT_STATISTIC, MAIL_CONTACTS, PEOPLE_CONTACTS} from '@/pages/Projects/constants'
import {throttle} from "@/utils/throttle";
import {notification} from 'ant-design-vue'

// interfaces


// props & pinia
const route = useRoute()

// constants
const TRACKER_LIST = ['open_tasks', 'in_progress_tasks', 'open_bugs', 'in_progress_bugs']

// refs
const projectName = ref('Placeholder')
const infoFields = ref(INFO_FIELDS)
const taskTracker = ref(TASK_TRACKER)
const projectStatistic = ref(PROJECT_STATISTIC)
const mailContacts = ref(MAIL_CONTACTS)
const peopleContacts = ref(PEOPLE_CONTACTS)
const listWithAvatars = ref([])
const pageLoading = ref({
  info: false,
  statistic: false,
  jira: false,
  people: false
})

// computed

// methods
const dataAssignment = (prop, counter, name) => {
  if (!prop.counter) prop.counter = 0
  prop.counter += counter
  prop.list.push(name)
}
const handleJiraLinkSave = async () => {
  pageLoading.value.jira = true
  try {
    await putProjectJira(`${route.params.project}`, taskTracker.value.jiraTask.value)
  } catch (e) {
    taskTracker.value.jiraTask.value = undefined
    notification.error({message: 'Error', description: e.message})
    console.log(e)
  } finally {
    getProjectJira(`${route.params.project}`)
      .then(parseProjectJira).finally(() => handleLoadingStatus('jira'))
  }
}
const parseProjectInfo = ({data: projectData}) => {
  projectStore.changeTitle(projectData.name)
  if (projectData.milestone) {
    projectStore.changeMilestoneId(`${projectData.milestone.id}`)
    projectStore.changeMilestoneName(`${projectData.milestone.name}`)
  }
  projectName.value = projectData.name
  Object.entries(mailContacts.value).forEach(([key, item]) => {
    mailContacts.value[key].value = getDeepValueByPath(projectData, [...item.dbName])
  })
  Object.entries(peopleContacts.value).forEach(([key, item]) => {
    peopleContacts.value[key].value = getDeepValueByPath(projectData, [...item.dbName]).map(item => item.id)
  })
  Object.entries(infoFields.value).forEach(([key, item]) => {
    if (item.inputType === 'date-range') {
      const dateFrom = projectData.info.date_from ? dayjs(new Date(projectData.info.date_from)) : null
      const dateTo = projectData.info.date_to ? dayjs(new Date(projectData.info.date_to)) : null
      infoFields.value.date.value = [dateFrom, dateTo]
    } else if (item.inputType === 'date' || item.inputType === 'date-short') {
      infoFields.value[key].value = projectData[item.dbName?.[0]][item.dbName?.[1]] ? dayjs(new Date(projectData[item.dbName?.[0]][item.dbName?.[1]])) : null
    } else if (item.dbName.length) infoFields.value[key].value = getDeepValueByPath(projectData, [...item.dbName])
  })
}
const parseProjectStatistic = ({data}) => {
  projectStatistic.value.total_man_month.counter = data.total_man_month
  
  Object.keys(data.offices).forEach((key) => dataAssignment(projectStatistic.value.offices, 1, key))
  Object.entries(data.headcount_by_departments).forEach(([key, item]) => dataAssignment(projectStatistic.value.headcount_by_departments, item, [key, item]))
}
const parseProjectJira = ({data: jiraData}) => {
  if (!jiraData) return
  taskTracker.value.jiraTask.value = jiraData.link
  
  TRACKER_LIST.forEach(snakeName => {
    const camelName = snakeToCamel(snakeName)
    if (typeof jiraData[snakeName] === 'number') {
      Object.entries(jiraData[`${snakeName}_priorities`]).forEach(([key, item]) => dataAssignment(taskTracker.value[camelName].value, item, [key, item]))
    } else taskTracker.value[camelName].value.counter = undefined
  })
}
const parsePeopleList = (people) => {
  listWithAvatars.value = people
}
const handleLoadingStatus = (value?: string) => {
  if (value) pageLoading.value[value] = false
  else {
    Object.keys(pageLoading.value).forEach(key => {
      pageLoading.value[key] = true
    })
  }
}

// function wrappedPutProjectInfo() {
//   putProjectInfo([window.location.pathname.split('/')[2]][0], {
//     contact_mail_dev_creatives: [contacts.value.mail.dev_creative.value],
//     contact_mail_dev_producers: [contacts.value.mail.dev_producer.value]
//   });
// }
// const throttledPutProjectInfo = throttle(wrappedPutProjectInfo, 3000);
// // watch
// watch(contacts.value.mail, ()=>{
//   throttledPutProjectInfo();
// }, )
// hooks
onMounted(async () => {
  handleLoadingStatus()
  getProjectStatistic(`${route.params.project}`)
    .then(parseProjectStatistic).finally(() => handleLoadingStatus('statistic'))
  getProjectJira(`${route.params.project}`)
    .then(parseProjectJira).finally(() => handleLoadingStatus('jira'))
  getProjectInfo(`${route.params.project}`)
    .then(parseProjectInfo).finally(() => handleLoadingStatus('info'))
  getStaffListWithAvatars()
    .then(parsePeopleList).finally(() => handleLoadingStatus('people'))
})
</script>

<style lang="scss" scoped>
.projects-info-page {
  &__block {
    margin-bottom: 20px;
    border: 1px solid $neutrals-border-default;
    border-top-right-radius: 8px;
    
    border-top-left-radius: 8px;
  }
  
  &__block-header {
    padding: 8px 12px;
    color: $neutrals-text-hint;
    background-color: #f4f5f8;
    border-bottom: 1px solid $neutrals-border-default;
    
    @include Button-M;
    
    &_sub-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 4px 12px;
      @include Body-S-12-Regular;
      gap: 24px;
    }
  }
  
  &__block-content + &__block-header {
    border-top: 1px solid $neutrals-border-default;
  }
  
  &__block-content {
    display: grid;
    background-color: $neutrals-border-default;
    gap: 1px;
  }
  
  &__horizontal-pair {
    display: flex;
    
    & > div {
      &:first-child {
        width: 66%;
        height: min-content;
      }
      
      &:last-child {
        width: 33%;
        height: min-content;
        margin-left: 20px;
      }
    }
  }
}

.gap {
  grid-column-start: 2;
  grid-row-end: 6;
  grid-row-start: 2;
  background-color: #fff;
}
</style>
