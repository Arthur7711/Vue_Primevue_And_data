<template>
  <a-table
    :columns="columns"
    :data-source="newData"
    bordered
    :pagination="false"
    rowClassName="rowcol"
  >
    <template #bodyCell="{ column, text, record }">
      <div
        v-if="['origins'].includes(column.dataIndex)"
        @click="save(record.key)"
      >
        <div>
          <div v-if="editableData[record.key]">
            <Tags
              v-model="editableData[record.key][column.dataIndex]"
              style="margin: -5px 0"
            />
          </div>
          <template v-else>
            <span
              v-for="(item, idx) in text"
              :key="item"
              @click.stop="edit(record.key)"
            >
              {{ idx === text.length - 1 ? `${item}` : `${item}, ` }}
            </span>
          </template>
        </div>
      </div>
      <template v-else-if="column.dataIndex === 'operation'">
        <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a-typography-link @click="save(record.key)"
              >Save</a-typography-link
            >
            <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a-typography-link @click.stop="edit(record.key)"
              >Edit</a-typography-link
            >
          </span>
        </div>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { reactive, computed, ref } from "vue";
import Tags from "./Tags.vue";
import { useAliasStore } from "@/stores/alias";
import type { IProps } from "./types";
const { setAliasDepartmentTags, setAliasPositionTags } = useAliasStore();

const props = defineProps<Partial<IProps>>();

const alias = computed(() => props.dataPosition || props.dataDepartment);

const columns = [
  {
    title: props.dataDepartment ? "Department" : "Position",
    dataIndex: "alias",
    width: "50%",
  },
  {
    title: "Alias",
    dataIndex: "origins",
    width: "50%",
  },
  {
    title: "operation",
    dataIndex: "operation",
  },
];

const newData = computed(() =>
  alias.value?.map((item, index) => ({
    key: index?.toString(),
    alias: item.alias,
    origins: item.origins,
  }))
);

// const dataSource = ref(newData.value)

const editableData: Partial<Record<string, any>> = reactive({});

const edit = (key: string) => {
  editableData[key] = cloneDeep(
    newData.value.filter((item) => key == item.key)[0]
  );
};

const save = async (key: string) => {
  Object.assign(
    newData.value.filter((item) => key === item.key)[0],
    editableData[key]
  );
  const currentData = newData.value.filter((item) => key === item.key)[0];

  delete editableData[key];
  if (props.dataDepartment) {
    await setAliasDepartmentTags({
      origins: currentData.origins,
      alias: currentData.alias,
    });
  }
  if (props.dataPosition) {
    await setAliasPositionTags({
      origins: currentData.origins,
      alias: currentData.alias,
    });
  }
};
const cancel = (key: string) => {
  delete editableData[key];
};
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
