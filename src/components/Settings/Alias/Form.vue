<template>
  <a-form :model="aliases" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
    @finish="onFinish" @finishFailed="onFinishFailed" >
    <a-form-item :label="props.inputLabel" name="firstInput"
      :rules="[{ required: true, message: 'Required field!' }]">
      <a-input v-model:value="aliases.firstInput" />
    </a-form-item>

   <!--Tags to add in modal-->
    <a-form-item  label="Alias" name="secondInput" :rules="[{ required: false }]">
      <AddAlias v-model:tags="aliases.secondInput" />
    </a-form-item>

    <a-form-item  :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
// import
import AddAlias from "@/components/Settings/Alias/AddAlias.vue";

interface SubmitFormType {
  firstInput: string;
  secondInput: string[];
}
// props & pinia
const props = defineProps<{
  inputLabel: string
  aliases: SubmitFormType
}>()

// constants
// refs
// computed

// methods
const emit = defineEmits<{
  (e: 'submit', values: SubmitFormType): void
}>()


const onFinish = (values) => {
  values.formName = props.inputLabel
  emit('submit', values)

};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
// watch
// hooks
</script>

<style scoped lang="scss"></style>