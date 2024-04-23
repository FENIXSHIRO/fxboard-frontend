<template>
  <div 
  class="border border-black"
  :class="{'createItem': isCreatingActive}"
  >
    <v-stage 
      ref="stage" 
      :config="configKonva" 
      @mousedown="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
    >
      <v-layer ref="layer">
        <v-circle
          v-for="item in items"
          :key="item.id"
          :config="item"
          @dragstart="handleDragstart"
          @dragend="handleDragend"
          @transformend="handleTransformEnd"
        ></v-circle>
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
    <Toolbar @add-circle="addCircle"/>
  </div>
</template>

<script lang="ts">
import Konva from "konva";
import Toolbar from "@/components/editor/Toolbar.vue";
  
const width = window.innerWidth;
const height = window.innerHeight;

interface Item {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  scaleX: number,
  scaleY: number,
  id: string;
  fill: string;
  draggable: boolean;
  name: string;
}

function generateItems(): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < 3; i++) {
    items.push({
      x: Math.random() * width,
      y: Math.random() * height,
      rotation: 0,
      radius: 50,
      scaleX: 1,
      scaleY: 1,
      id: `node-${i}`,
      fill: Konva.Util.getRandomColor(),
      draggable: true,
      name: `node-${i}`
    });
  }
  return items;
}

export default {
  components: {
    Toolbar // Регистрируем компонент тулбара
  },
  data() {
    return {
      items: [] as Item[],
      dragItemId: null as string | null,
      configKonva: {
        width: width,
        height: height,
      },
      selectedShapeName: '',
      isCreatingActive: false
    };
  },
  computed: {
  },
  methods: {
    handleDragstart(e: any) {
      // save drag element:
      this.dragItemId = e.target.id();
      // move current element to the top, by rearranging the items array:
      const item = this.items.find((i) => i.id === this.dragItemId);
      if (item) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
        this.items.push(item);
      }
    },
    handleDragend(e: any) {
      this.dragItemId = null;
    },
    handleTransformEnd(e: { target: { x: () => number; y: () => number; rotation: () => number; scaleX: () => number; scaleY: () => number; }; }) {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const item = this.items.find(
        (r) => r.name === this.selectedShapeName
      );
      if(item === undefined) return;
      // update the state
      item.x = e.target.x();
      item.y = e.target.y();
      item.rotation = e.target.rotation();
      item.scaleX = e.target.scaleX();
      item.scaleY = e.target.scaleY();

      // change fill
      item.fill = Konva.Util.getRandomColor();
    },
    handleStageMouseDown(e: { target: { getStage: () => any; getParent: () => { (): any; new(): any; className: string; }; name: () => any; }; }) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = '';
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name();
      const item = this.items.find((r) => r.name === name);
      if (item) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = '';
      }
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = (this.$refs.transformer as any).getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne('.' + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode]);
      } else {
        // remove transformer
        transformerNode.nodes([]);
      }
    },
    addCircle() {
      const stage = (this.$refs.stage as Konva.Stage).getStage();
      this.isCreatingActive = true
      stage.on('click', (e) => {
        const pos = stage.getPointerPosition();
        if (pos) {
          const newItem: Item = {
            x: pos.x,
            y: pos.y,
            rotation: 0,
            radius: 50,
            scaleX: 1,
            scaleY: 1,
            id: `node-${this.items.length}`,
            fill: Konva.Util.getRandomColor(),
            draggable: true,
            name: `node-${this.items.length}`
          };
          this.items.push(newItem);
          stage.off('click');
          this.isCreatingActive = false
        }
      });
    } 
  },
  mounted() {
    this.items = generateItems();
  },
};

</script>

<style scoped>
.createItem {
  cursor: crosshair;
}
</style>
