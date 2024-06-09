import {type IBlockItem, IBlockItemStatistic} from '@/components/Projects/Information/ProjectInformationBlockItem.vue'

export const OFFICES_OPTIONS = [
  {title: 'Yerevan'},
  {title: 'Saint-Petersburg'},
  {title: 'Porto'},
  {title: 'Madrid'},
]

export const PROJECTS_OPTIONS = [
  {title: 'Inferno'},
  {title: 'Magnus'},
  {title: 'Administration'},
  {title: 'Cron'},
  {title: 'Painkiller'},
  {title: 'Mudrunner'},
  {title: 'Snow Runner'},
  {title: 'Ardena'},
  {title: 'Biomutant'},
  {title: 'Carmagedon'},
  {title: 'Casino Slototerra'},
  {title: 'Comino'},
  {title: 'Dakar'},
  {title: 'Dacker'},
  {title: 'Evil Dead'},
  {title: 'FOR'},
  {title: 'FTB'},
  {title: 'Hunter'},
]

export const AREA_CAHRT_PROJECT_TABLE_DATA = [
  {projects: 'Art', headcount: 130},
  {projects: 'IT', headcount: 100},
  {projects: 'HR', headcount: 90},
  {projects: 'Outsource', headcount: 90},
]

export const AREA_CAHRT_DEPARTMENT_TABLE_DATA = [
  {department: 'Art', statistics: 130},
  {department: 'IT', statistics: 100},
  {department: 'HR', statistics: 90},
  {department: 'Outsource', statistics: 90},
]
export const FILTERS_DEFAULT = {
  project_name: undefined,
  milestone: undefined,
  studios: undefined,
  offices: undefined,
}
export const MILESTONE_OPTIONS = [
  {title: 'Pitch'},
  {title: 'Concept'},
  {title: 'Feasibility'},
  {title: 'Prototype'},
  {title: '1st Playable'},
  {title: 'Vertical Slice'},
  {title: 'Vertical Chunk'},
  {title: 'Alpha'},
  {title: 'Content Complete'},
  {title: 'Beta'},
  {title: 'Code Lock'},
  {title: 'Certification'},
  {title: 'RTM'},
  {title: 'Post Launch'},
  {title: 'Cancelled'},
  {title: 'Blocked / On Hold'},
  {title: 'Complete'},
  {title: 'No milestones'},
]
export const STUDIOS_OPTIONS = [
  {title: 'Saber Interactive'},
  {title: 'Bytex'},
  {title: 'Fractured Byte'},
  {title: '34BT'},
  {title: 'Bitbox'},
]

export const INFO_FIELDS = {
  date: <IBlockItem>{
    title: 'Date',
    placeholder: '+ Add date',
    icon: 'calendar',
    value: undefined,
    inputType: 'date-range',
    dbName: ['info', 'date']
  },
  largestConcern: <IBlockItem>{
    title: 'Largest Concern',
    placeholder: '+ Add information',
    icon: 'message',
    value: undefined,
    inputType: 'input',
    dbName: ['info', 'largest_concern']
  },
  platforms: <IBlockItem>{
    title: 'Platforms',
    placeholder: '+ Add tags',
    icon: 'tag',
    value: undefined,
    inputType: 'tag',
    dbName: ['platforms']
  },

  cert: <IBlockItem>{
    title: 'CERT1 upload',
    placeholder: '+ Add date',
    icon: 'calendar',
    value: undefined,
    inputType: 'date-short',
    dbName: ['info', 'cert1_upload_date']
  },
  contractStatus: <IBlockItem>{
    title: 'Contract status',
    placeholder: '+ Add tags',
    icon: 'tag',
    value: undefined,
    inputType: 'tag',
    dbName: ['contract_statuses']
  },
  distribution: <IBlockItem>{
    title: 'Distribution',
    placeholder: '+ Add tags',
    icon: 'tag',
    value: undefined,
    inputType: 'tag',
    dbName: ['distributions']
  },

  engine: <IBlockItem>{
    title: 'Engine',
    placeholder: '+ Add tags',
    icon: 'tag',
    value: undefined,
    inputType: 'tag',
    dbName: ['engines']
  },
  finalCert: <IBlockItem>{
    title: 'Final CERT',
    placeholder: '+ Add date',
    icon: 'calendar',
    value: undefined,
    inputType: 'date-short',
    dbName: ['info', 'final_cert_date']
  },
  initialReleaseTarget: <IBlockItem>{
    title: 'Initial Release Target',
    placeholder: '+ Add date',
    icon: 'calendar',
    value: undefined,
    inputType: 'date',
    dbName: ['info', 'initial_release_target_date']
  },

  initialHydra: <IBlockItem>{
    title: 'Initial Hydra/PROS by',
    placeholder: '+ Add date',
    icon: 'calendar',
    value: undefined,
    inputType: 'date-short',
    dbName: ['info', 'initial_pros_date']
  },
  mainSkuPrice: <IBlockItem>{
    title: 'Main SKU Price',
    placeholder: '+ Input value',
    icon: 'message',
    value: undefined,
    inputType: 'input',
    dbName: ['info', 'main_sku_price']
  },
  overallProgress: <IBlockItem>{
    title: 'Overall Progress (auto)',
    placeholder: undefined,
    icon: 'flag',
    value: undefined,
    inputType: 'progress',
    dbName: []
  },

  pros: <IBlockItem>{
    title: 'PROS',
    placeholder: '+ Add tags',
    icon: 'tag',
    value: undefined,
    inputType: 'tag',
    dbName: ['pros']
  },
  qaFinaling: <IBlockItem>{
    title: 'QA Finalizing',
    placeholder: '+ Add date',
    icon: 'calendar',
    value: undefined,
    inputType: 'date',
    dbName: ['info', 'qa_finalizing_date']
  },
  qaFinaling2: <IBlockItem>{
    title: 'QA Finalizing 2',
    placeholder: '+ Add date',
    icon: 'calendar',
    value: undefined,
    inputType: 'date-short',
    dbName: ['info', 'qa_finalizing_2_date']
  },

  RTM: <IBlockItem>{
    title: 'RTM',
    placeholder: '+ Add date',
    icon: 'calendar',
    value: undefined,
    inputType: 'date-short',
    dbName: ['info', 'rtm_date']
  },
  ratingSubmitted: <IBlockItem>{
    title: 'Rating Submitted (Content Complete)',
    placeholder: '+ Add date',
    icon: 'calendar',
    value: undefined,
    inputType: 'date-short',
    dbName: ['info', 'rating_submitted_date']
  },
  vsOriginalTarget: <IBlockItem>{
    title: 'Vs. Original Target',
    placeholder: '+ Add tags',
    icon: 'tag',
    value: undefined,
    inputType: 'tag',
    dbName: ['vs_original_targets']
  }
}
export const TASK_TRACKER = {
  jiraTask: <IBlockItem>{
    title: 'Jira task',
    placeholder: 'Insert Jira link here',
    icon: 'link',
    value: undefined,
    inputType: 'jira-link',
  },
  sourceControl: <IBlockItem>{
    title: 'Source Control',
    placeholder: 'No information',
    icon: 'link',
    value: undefined,
    inputType: 'input',
  },
  openTasks: <IBlockItem>{
    title: 'Open tasks',
    placeholder: 'No data',
    icon: 'poll',
    value: {
      counter: undefined,
      list: []
    },
    inputType: 'statistic',
  },
  inProgressTasks: <IBlockItem>{
    title: 'In progress tasks',
    placeholder: 'No data',
    icon: 'poll',
    value: {
      counter: undefined,
      list: []
    },
    inputType: 'statistic',
  },
  openBugs: <IBlockItem>{
    title: 'Open bugs',
    placeholder: 'No data',
    icon: 'poll',
    value: {
      counter: undefined,
      list: []
    },
    inputType: 'statistic',
  },
  inProgressBugs: <IBlockItem>{
    title: 'In progress bugs',
    placeholder: 'No data',
    icon: 'poll',
    value: {
      counter: undefined,
      list: []
    },
    inputType: 'statistic',
  },
}
export const PROJECT_STATISTIC = {
  total_man_month: <IBlockItemStatistic>{
    counter: undefined,
    list: []
  },
  offices: <IBlockItemStatistic>{
    counter: undefined,
    list: []
  },
  headcount_by_departments: <IBlockItemStatistic>{
    counter: undefined,
    list: []
  },
}
export const MAIL_CONTACTS = <{devCreative: IBlockItem, devProducer: IBlockItem}>{
  devCreative: {
    title: 'Dev Creative',
    placeholder: '+ Add mail',
    icon: 'link',
    value: undefined,
    inputType: 'mail',
    dbName: ['contact_mail_dev_creatives', '0']
  },
  devProducer: {
    title: 'Dev Producer',
    placeholder: '+ Add mail',
    icon: 'link',
    value: undefined,
    inputType: 'mail',
    dbName: ['contact_mail_dev_producers', '0']
  }
}
export const PEOPLE_CONTACTS = {
  pubCreative: {
    title: 'Pub Creative',
    placeholder: 'No information',
    icon: 'account-multiple',
    value: undefined,
    inputType: 'people',
    dbName: ['contact_people_pub_creatives']
  },
  pubProducer: {
    title: 'Pub Producer',
    placeholder: 'No information',
    icon: 'account-multiple',
    value: undefined,
    inputType: 'people',
    dbName: ['contact_people_pub_producers']
  }
}
