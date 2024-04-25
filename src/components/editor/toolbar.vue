<template>
  <div class="flex flex-col toolbar absolute left-[10px] bg-[#ececec] top-1/3 border-[1px] rounded-lg border-solid border-[#4b4b4b]">
    <button class="px-4 py-1 rounded-lg hover:bg-slate-300" @click="addCircle">◯</button>
    <button class="px-4 py-1 rounded-lg hover:bg-slate-300" @click="addSquare">▢</button>
    <button class="px-4 py-1 rounded-lg hover:bg-slate-300" @click="addTriangle">◰</button>
  </div>
</template>

<script>
export default {
  methods: {
    addCircle() {
      this.$emit('add-circle');
    },
    addSquare() {
      this.$emit('add-square');
    },
    addTriangle() {
      this.$emit('add-triangle');
    }
  }
}
</script>

<style scoped>
</style>