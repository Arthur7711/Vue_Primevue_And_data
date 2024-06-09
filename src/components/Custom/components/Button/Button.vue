<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { type StyleValue } from "vue";
import type { UIButtonStyleProps } from "./types";
import { ButtonWidth, ButtonHeight } from "./functions/ButtonSizes";
import { PlusColor } from "./functions/PlusColor";
import Loader from "../Loader/Loader";
import { IconSide } from "./functions/IconSide";
import PlusIcon from "../assets/image/PlusIcon.vue";

const props = defineProps<UIButtonStyleProps>();
const st = (): StyleValue => {
  return {
    flexDirection: IconSide(props.icon_side),
    width: ButtonWidth(props.size),
    height: ButtonHeight(props.size),
  };
};

const styleLoader = (): StyleValue => {
  return {
    width: "108px",
    // height: ButtonHeight(props.size),
  };
};
</script>

<template>
  <button
    :style="st()"
    class="ui-button"
    id="ui_button"
    :class="'ui-button-' + (colorScheme ? colorScheme : 'primary')"
    :disabled="!!disable || isUpdate"
  >
    <PlusIcon
      v-if="show_icon && !isUpdate"
      :color="
        disable ? '#aab3c2' : PlusColor(colorScheme ? colorScheme : 'primary')
      "
    />
    <div
      v-if="isUpdate"
      :style="styleLoader()"
      class="ui-button-container-loader"
    >
      <Loader />
    </div>
    <slot v-if="!isUpdate" name="content"></slot>
  </button>
</template>

<style lang="scss" scoped>
@import "./Button.scss";
</style>
