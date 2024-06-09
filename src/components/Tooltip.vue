<template>
  <div class="tooltip-container" @mouseover="show = true" @mouseleave="show = false">
    <slot></slot>
    <div v-if="show" :class="tooltipClasses" :style="tooltipStyles">
      {{ content }}
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "Tooltip",
  props: {
    content: String,
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    tooltipClasses() {
      return {
        'tooltip': true,
        'top': true,
        'right': true,
      };
    },
    tooltipStyles() {
      return {
        top: '-40px',
        bottom: 'auto',
        left: this.isTooltipLeft() ? '0' : 'auto',
        right: '20px' ,
      };
    },
  },
  methods: {
    isTooltipTop() {
      const rect = this.$el.getBoundingClientRect();
      return rect.top > window.innerHeight / 2;
    },
    isTooltipBottom() {
      const rect = this.$el.getBoundingClientRect();
      return rect.top <= window.innerHeight / 2;
    },
    isTooltipLeft() {
      const rect = this.$el.getBoundingClientRect();
      return rect.left < window.innerWidth / 2;
    },
    isTooltipRight() {
      const rect = this.$el.getBoundingClientRect();
      return rect.left >= window.innerWidth / 2;
    },
  },
})

</script>




<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
  width: 5rem;
  border-color: #070606;
}

.tooltip {
  position: absolute;
  background-color: #FFFFFF;
  color: #162138;
  padding: 5px;
  min-width: 140px;
  border: 1px solid #E2E5EA;
  border-radius: 4px;
  z-index: 1000;
}
.top {
  transform: translateY(-100%);
}
.bottom {
  transform: translateY(0);
}
.left {
  transform: translateX(-100%);
}
.right {
  transform: translateX(2rem);
}
</style>