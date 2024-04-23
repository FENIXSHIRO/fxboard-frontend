<template>
  <div class="flex flex-col toolbar absolute left-1 bg-[#ececec] top-[300px] border-[1px] rounded-lg border-solid border-[#4b4b4b]">
    <button class="px-4 py-1 rounded-lg hover:bg-slate-300" @click="addCircle">◯</button>
    <button class="px-4 py-1 rounded-lg hover:bg-slate-300" @click="addCircle">▢</button>
    <button class="px-4 py-1 rounded-lg hover:bg-slate-300" @click="addCircle">◰</button>
  </div>
</template>

<script>
export default {
  methods: {
    addCircle() {
      this.$emit('add-circle');
    }
  }
}
</script>

<style scoped>
.toolbar {
  position: absolute;
  left: 20px;
  top: 300px;
}
</style>