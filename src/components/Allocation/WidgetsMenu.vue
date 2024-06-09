<template>
  <div class="widgets">
    <button class="title" @click.stop="$emit('update:modelValue', !modelValue)">Widget setting</button>
    <div v-if="modelValue" class="menu">
      <p style="margin-top: -30px; width: 60px;">Menu</p>
      <div  @click.stop="isShow" v-for="item in widgetItems" :key="item.key">
        <span>{{item.name}}</span>
        <span @click.stop="isShow(item.name)">
          <IconEyeOpen v-if="!isShowWidget[item.key]"/>
          <IconEyeClose v-else/>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import IconEyeOpen from "../icons/IconEyeOpen.vue";
import IconEyeClose from "../icons/IconEyeClose.vue";
export interface IWidgetItems {
  date: boolean,
  department_group: boolean,
  department: boolean,
  division: boolean,
  team: boolean,
  project_group: boolean,
  project: boolean,
  studio: boolean,
  office: boolean,
  users: boolean,
}

const props = defineProps<{ modelValue: boolean}>()
const emit = defineEmits<{(e: 'isShowWidgets', value: IWidgetItems )}>()

const widgetItems = [
  {name: "M/M by Date", key: 'date'},
  {name: "M/M by Department group", key: 'department_group'},
  {name: "M/M by Department", key: 'department'},
  {name: "M/M by Division", key: 'division'},
  {name: "M/M by Team", key: 'team'},
  {name: "M/M by Project Group", key: 'project_group'},
  {name: "M/M by Project", key: 'project'},
  {name: "M/M by Studio", key: 'studio'},
  {name: "M/M by Office", key: 'office'},
  {name: "Users", key: 'users'},
]
const isShowWidget = ref<IWidgetItems>({
  date: false,
  department_group: false,
  department: false,
  division: false,
  team: false,
  project_group: false,
  project: false,
  studio: false,
  office: false,
  users: false,
})

const isShow = (e) => {
  const value = e.target? e.target.firstChild.textContent:e

  switch (value){
    case "M/M by Date":
      isShowWidget.value.date = !isShowWidget.value.date
      break;
    case "M/M by Department group":
      isShowWidget.value.department_group = !isShowWidget.value.department_group
      break;
    case "M/M by Department":
      isShowWidget.value.department = !isShowWidget.value.department
      break;
    case "M/M by Division":
      isShowWidget.value.division = !isShowWidget.value.division
      break;
    case "M/M by Team":
      isShowWidget.value.team = !isShowWidget.value.team
      break;
    case "M/M by Project Group":
      isShowWidget.value.project_group = !isShowWidget.value.project_group
      break;
    case "M/M by Project":
      isShowWidget.value.project = !isShowWidget.value.project
      break;
    case "M/M by Studio":
      isShowWidget.value.studio = !isShowWidget.value.studio
      break;
    case "M/M by Office":
      isShowWidget.value.office = !isShowWidget.value.office
      break;
    case "Users":
      isShowWidget.value.users = !isShowWidget.value.users
      break;
  }
};

watch(()=>isShowWidget, ()=>{
  emit("isShowWidgets", isShowWidget.value)
}, {deep: true})
</script>

<style scoped lang="scss">
::v-deep(.p-button .p-component) {
    background-color: transparent !important;
}
.widgets{
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 5px
}
.title{
  background-color: transparent;
  border: none
}
.menu {
  margin-top: 22px;
  background-color: #fff;
  position: absolute;
  width: 230px;
  transition: all 2s ease-out;
  right: 0.1rem;
  border-radius: 8px;
  border: 1px solid $neutrals-border-default;
  padding: 8px;
  z-index: 5;

  &>div {
    padding-top: 10px;
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center
  }
}

</style>
