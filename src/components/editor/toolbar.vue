<template>
  <div class="toolbar bg-gray-50 border-1 border-black">
    <button @click="addCircle">O</button>
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