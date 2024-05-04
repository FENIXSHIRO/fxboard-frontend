<template>
  <div>
    <v-stage :config="stageSize">
      <v-layer>
        <v-circle
          v-for="target in targets"
          :key="target.id"
          :config="circleConfig(target)"
          @dragmove="handleDrag(target, $event)"
        />
        <v-arrow
          v-for="connector in connectors"
          :key="connector.id"
          :config="arrowConfig(connector)"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Konva from "konva";

export default defineComponent({
  components: {
  },
  data() {
    return {
      targets: Array.from({ length: 10 }, (_, i) => ({
        id: `target-${i}`,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      })),
      connectors: [] as any[],
      stageSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  },
  mounted() {
    this.generateConnectors();
  },
  methods: {
    generateConnectors() {
      for (let i = 0; i < 10; i++) {
        const fromIndex = Math.floor(Math.random() * this.targets.length);
        let toIndex = Math.floor(Math.random() * this.targets.length);
        while (fromIndex === toIndex) {
          toIndex = Math.floor(Math.random() * this.targets.length);
        }
        const from = this.targets[fromIndex];
        const to = this.targets[toIndex];
        this.connectors.push({
          id: `connector-${i}`,
          from,
          to,
        });
      }
    },
    handleDrag(target: any, evt: any) {
      const { x, y } = evt.target.position();
      target.x = x;
      target.y = y;
    },
    circleConfig(target: any) {
      return {
        x: target.x,
        y: target.y,
        fill: Konva.Util.getRandomColor(),
        radius: 20 + Math.random() * 20,
        shadowBlur: 10,
        draggable: true,
      };
    },
    arrowConfig(connector: any) {
      return {
        points: this.getConnectorPoints(connector.from, connector.to),
        stroke: 'black',
        fill: 'black',
      };
    },
    getConnectorPoints(from: any, to: any) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const angle = Math.atan2(-dy, dx);
      const radius = 50;
      return [
        from.x + -radius * Math.cos(angle + Math.PI),
        from.y + radius * Math.sin(angle + Math.PI),
        to.x + -radius * Math.cos(angle),
        to.y + radius * Math.sin(angle),
      ];
    },
  },
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #f0f0f0;
}
</style>