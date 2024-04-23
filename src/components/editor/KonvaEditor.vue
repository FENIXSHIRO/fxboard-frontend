<template>
  <div 
    class=""
    :class="{'createItem': isCreatingActive}"
  >
    <v-stage 
      ref="stage" 
      :config="configKonva" 
      @mousedown="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
    >
      <!-- Фоновая сетка -->
      <v-layer>
        <!-- Точки сетки -->
        <template v-for="x in gridColumns">
          <template v-for="y in gridRows"
          :key="'gridPoint' + x + '-' + y"
          >
            <v-circle
              :x="x * gridSize"
              :y="y * gridSize"
              radius="1"
              fill="#ccc"
            />
          </template>
        </template>
      </v-layer>
      
      <v-layer ref="layer">
        <!-- Остальные элементы (фигуры) добавляются поверх сетки -->
        <component
          v-for="item in items"
          :is="getShapeComponent(item.shapeType)"
          :key="item.id"
          :config="item"
          @dragstart="handleDragstart"
          @dragend="handleDragend"
          @transformend="handleTransformEnd"
        ></component>
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
    <Toolbar 
      @add-circle="addCircle"
      @add-square="addSquare"
      @add-triangle="addTriangle"
    />
  </div>
</template>

<script lang="ts">
import Konva from "konva";
import Toolbar from "@/components/editor/Toolbar.vue";

const width = window.innerWidth;
const height = window.innerHeight;
const gridSize = 20; // Размер клетки сетки
const gridColumns = Math.ceil(width / gridSize);
const gridRows = Math.ceil(height / gridSize);

interface Item {
  x: number;
  y: number;
  rotation: number;
  scaleX: number,
  scaleY: number,
  id: string;
  fill: string;
  draggable: boolean;
  name: string;
  shapeType: string; // Добавлен новый атрибут для определения типа фигуры
  // Параметры, специфичные для разных фигур
  radius?: number;
  width?: number;
  height?: number;
  sides?: number; // для треугольников
}

export default {
  components: {
    Toolbar
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
      isCreatingActive: false,
      currentShapeType: '', // текущий тип фигуры для добавления
      gridSize: gridSize,
      gridColumns: gridColumns,
      gridRows: gridRows
    };
  },
  computed: {
    stageWidth(): number {
      return this.gridColumns * this.gridSize;
    },
    stageHeight(): number {
      return this.gridRows * this.gridSize;
    }
  },
  methods: {
    getShapeComponent(shapeType: string) {
      switch (shapeType) {
        case 'circle':
          return 'v-circle';
        case 'square':
          return 'v-rect';
        case 'triangle':
          return 'v-regular-polygon';
        default:
          return 'v-circle'; // по умолчанию, возвращаем круг
      }
    },
    handleDragstart(e: any) {
      // сохранить идентификатор перетаскиваемого элемента
      this.dragItemId = e.target.id();
      // поднять элемент в списке
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
      // обновить свойства элемента после трансформации
      const item = this.items.find(
        (r) => r.name === this.selectedShapeName
      );
      if(item === undefined) return;
      item.x = e.target.x();
      item.y = e.target.y();
      item.rotation = e.target.rotation();
      item.scaleX = e.target.scaleX();
      item.scaleY = e.target.scaleY();
      item.fill = Konva.Util.getRandomColor(); // изменить цвет для наглядности
    },
    handleStageMouseDown(e: { target: { getStage: () => any; getParent: () => { (): any; new(): any; className: string; }; name: () => any; }; }) {
      // если кликнули по сцене, очистить выбор
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = '';
        this.updateTransformer();
        return;
      }

      // если кликнули по трансформеру, ничего не делать
      const clickedOnTransformer =
        e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }

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
      const transformerNode = (this.$refs.transformer as any).getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne('.' + selectedShapeName);
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        transformerNode.nodes([selectedNode]);
      } else {
        transformerNode.nodes([]);
      }
    },
    addShape(shapeType: string) {
      const stage = (this.$refs.stage as Konva.Stage).getStage();
      this.isCreatingActive = true;
      this.currentShapeType = shapeType;

      let newItem: Item; // Определяем переменную здесь

      stage.on('click', (e) => {
        const pos = stage.getPointerPosition();
        if (pos) {
          switch (shapeType) {
            case 'circle':
              newItem = {
                x: pos.x,
                y: pos.y,
                rotation: 0,
                radius: 50,
                scaleX: 1,
                scaleY: 1,
                id: `node-${this.items.length}`,
                fill: Konva.Util.getRandomColor(),
                draggable: true,
                name: `node-${this.items.length}`,
                shapeType: 'circle',
              };
              break;
            case 'square':
              newItem = {
                x: pos.x,
                y: pos.y,
                rotation: 0,
                width: 100,
                height: 100,
                scaleX: 1,
                scaleY: 1,
                id: `node-${this.items.length}`,
                fill: Konva.Util.getRandomColor(),
                draggable: true,
                name: `node-${this.items.length}`,
                shapeType: 'square',
              };
              break;
            case 'triangle':
              newItem = {
                x: pos.x,
                y: pos.y,
                rotation: 0,
                sides: 3,
                scaleX: 1,
                scaleY: 1,
                id: `node-${this.items.length}`,
                fill: Konva.Util.getRandomColor(),
                draggable: true,
                name: `node-${this.items.length}`,
                shapeType: 'triangle',
              };
              break;
            default:
              break;
          }

          if (newItem) { // Проверяем, определена ли newItem
            this.items.push(newItem);
            stage.off('click');
            this.isCreatingActive = false;
          }
        }
      });
    },
    addCircle() {
      this.addShape('circle');
    },
    addSquare() {
      this.addShape('square');
    },
    addTriangle() {
      this.addShape('triangle');
    }
  },
  mounted() {
    this.items = []; // Изменить начальные значения или оставить пустым
  },
};

</script>

<style scoped>
.createItem {
  cursor: crosshair;
}
</style>