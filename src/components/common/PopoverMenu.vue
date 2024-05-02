<template>
  <el-popover
    :placement="placement"
    :disabled="disabled"
    :width="width"
    :hide-after="hideAfter"
    :show-after="showAfter"
    :trigger="trigger"
    :popper-style="customStyle"
    @before-leave="startClose"
    @after-leave="endClose"
    @show="onShow"
    @hide="onHide"
    :visible="visible"
    @update:visible="onVisible"
  >
    <div class="flex flex-col" @click="close">
      <slot name="menu" />
    </div>
    <template #reference v-if="$slots.default">
      <slot />
    </template>
  </el-popover>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String || Number,
      default: ''
    },
    trigger: {
      type: String,
      default: 'click'
    },
    hideAfter: {
      type: Number,
      default: 200
    },
    showAfter: {
      type: Number,
      default: 0
    }
  },
  emits: ['hide', 'show'],
  data: () => ({
    visible: false,
    customStyle: ''
  }),
  methods: {
    onKeyDown(e: KeyboardEvent): boolean {
      if (e.code === 'Escape') {
        this.close()
        return true
      }
      return false
    },
    close() {
      this.visible = false
    },
    show() {
      this.visible = true
    },
    startClose() {
      this.customStyle = 'visibility: hidden;'
    },
    endClose() {
      this.customStyle = ''
    },
    onShow() {
      this.$emit('show')
    },
    onHide() {
      this.$emit('hide')
    },
    onVisible(value: boolean) {
      this.visible = value
    }
  }
})
</script>

<style scoped></style>
