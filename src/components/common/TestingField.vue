<template>
  <div id="app">
    <v-stage
      :config="stageConfig"
      @dragend="handleDragEnd"
    >
      <v-layer>
        <v-circle
          v-for="(circle, index) in circles"
          :key="index"
          :config="circle"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      stageConfig: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        draggable: true
      },
      circles: []
    };
  },
  mounted() {
    this.generateCircles();
  },
  methods: {
    handleDragEnd(e) {
      this.stageConfig.x = e.target.x();
      this.stageConfig.y = e.target.y();
      this.generateCircles();
      console.log(this.circles.length)
    },
    generateCircles() {
      const WIDTH = 25;
      const HEIGHT = 25;
      const startX = Math.floor((-this.stageConfig.x - window.innerWidth) / WIDTH) * WIDTH;
      const endX = Math.floor((-this.stageConfig.x + window.innerWidth * 2) / WIDTH) * WIDTH;
      const startY = Math.floor((-this.stageConfig.y - window.innerHeight) / HEIGHT) * HEIGHT;
      const endY = Math.floor((-this.stageConfig.y + window.innerHeight * 2) / HEIGHT) * HEIGHT;

      const newCircles = [];
      for (let x = startX; x < endX; x += WIDTH) {
        for (let y = startY; y < endY; y += HEIGHT) {
          // Удаление точек, выходящих за пределы видимой области экрана
          if (x >= -this.stageConfig.x && x <= -this.stageConfig.x + window.innerWidth &&
              y >= -this.stageConfig.y && y <= -this.stageConfig.y + window.innerHeight) {
            newCircles.push({
              x: x + WIDTH / 2,
              y: y + HEIGHT / 2,
              radius: 1, // Размер точки
              listening: false,
              perfectDrawEnabled: false,
              shadowForStrokeEnabled: false,
              hitStrokeWidth: 0,
              fill: 'black' // Цвет точки
            });
          }
        }
      }
      this.circles = newCircles;
    }
  }
};
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>