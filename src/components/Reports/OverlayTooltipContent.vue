<script setup lang="ts">
import { IDocumentStatusIndividual } from "@/api/reports";
import dayjs from "dayjs";
const props = defineProps<{
  data: IDocumentStatusIndividual;
}>();
console.log(props.data);
</script>

<template>
  <section
    v-if="data && data.last_process && data.last_process"
    class="overlay_tooltip_content-container"
  >
    <span>
      {{ dayjs(data.last_process.updated_at).format("DD MMM, YYYY") }}
      at
      {{
        data.last_process.updated_at
          .split("T")[1]
          .split(":")
          .slice(0, 2)
          .join(":")
      }}
    </span>
    <a
      target="_blank"
      :href="
        'https://start.saber3d.net/#/staff/user/' +
        data.last_process.user.samaccountname
      "
    >
      {{ data.last_process.user.displayname }}
      <OutLinkSquareIcon />
    </a>
  </section>
  <section v-else class="overlay_tooltip_content-container">
    <span>no data</span>
  </section>
</template>

<style lang="scss">
.overlay_tooltip_content-container {
  line-height: 2;
  display: flex;
  flex-direction: column;
  span {
    font-weight: 400;
    color: $neutrals-text-secondary;
    font-size: 12px;
  }
  a {
    color: $primary-text-default;
    font-size: 14px;
  }
}
</style>
