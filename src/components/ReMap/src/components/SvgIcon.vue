<template>
  <svg aria-hidden="true" class="svg-icon-component" :style="iconSize">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SvgIcon",
  props: {
    prefix: {
      type: String,
      default: "icon"
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: "#333"
    },
    width: {
      type: Number,
      default: 32
    },
    height: {
      type: Number,
      default: 32
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);
    const iconSize = computed(
      () => `--width: ${props.width}px; --height: ${props.height}px;`
    );
    return { symbolId, iconSize };
  }
});
</script>

<style lang="scss" scoped>
.svg-icon-component {
  --width: 32px;
  --height: 32px;

  width: var(--width);
  height: var(--height);
  vertical-align: middle;
}
</style>
