<template>
  <div 
    class=""
    :class="{'createItem': isCreatingActive}"
  >
    <v-stage 
      ref="stage" 
      :config="configKonva"
      @click="handleStageMouseClick"
      @touchstart="handleStageMouseClick"
      @wheel="handleStageWheel"
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
              :config="bgGridConfig"
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
          @contextmenu="openContext($event)"
          @dragmove="handleDragMove"
          @transform="handleTransform"
        ></component>
        <v-transformer ref="transformer" />
        <ConnectionAnchor
          v-if="isNodeEditiong"
          :x="connectionAnchorProps.x"
          :y="connectionAnchorProps.y"
          :scaleX="connectionAnchorProps.scaleX"
          :scaleY="connectionAnchorProps.scaleY"
        />
      </v-layer>
    </v-stage>
    <Toolbar 
      @add-circle="addCircle"
      @add-square="addSquare"
      @add-triangle="addTriangle"
    />
    <ContextMenu
      :showMenu="showContextMenu"
      :mouseX="mouseClickX"
      :mouseY="mouseClickY"
      @update:showMenu="showContextMenu = $event"
     >
     <template #menu>
      <button @click="deleteShape">Удалить</button>
     </template>
    </ContextMenu>
  </div>
</template>

<script lang="ts">
import Konva from "konva";
import Toolbar from "@/components/editor/Toolbar.vue";
import ContextMenu from "@/components/common/ContextMenu.vue";
import ConnectionAnchor from "@/components/editor/ConnectionAnchor.vue"
import { KonvaEventObject } from "konva/lib/Node";
import { Transform } from "konva/lib/Util";

const width = window.innerWidth;
const height = window.innerHeight;

interface Item {
  x: number;
  y: number;
  rotation: number;
  scaleX: number,
  scaleY: number,
  id: string;
  draggable: boolean;
  name: string;
  shapeType: string;
  strokeScaleEnabled: false;
  offsetX?: number,
  offsetY?: number,
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  // Параметры, специфичные для разных фигур
  radius?: number;
  width?: number;
  height?: number;
  sides?: number; // для треугольников
}

export default {
  components: {
    Toolbar,
    ContextMenu,
    ConnectionAnchor
  },
  data() {
    return {
      items: [] as Item[],
      dragItemId: null as string | null,
      configKonva: {
        width: width,
        height: height,
        draggable: true
      },
      bgGridConfig: {
        radius: 1,
        fill: '#111',
        listening: false
      },
      selectedShapeName: '',
      isCreatingActive: false,
      isNodeEditiong: false,
      currentShapeType: '', // текущий тип фигуры для добавления
      gridSize: 20,
      gridColumns: Math.ceil(window.innerWidth / 20),
      gridRows: Math.ceil(window.innerHeight / 20),
      stageScale: 1, // Добавляем переменную для отслеживания масштаба
      showContextMenu: false,
      mouseClickX: 0,
      mouseClickY: 0,
      selectedShape: null as Konva.Shape | Object | null,
      connectionAnchorProps: {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      }
    };
  },
  computed: {
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
    handleDragMove(e: Konva.KonvaEventObject<DragEvent>) {
      this.connectionAnchorProps.x = e.target.x()
      this.connectionAnchorProps.y = e.target.y()
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
      item.stroke = Konva.Util.getRandomColor(); // изменить цвет для наглядности

      this.updateTransformer();
    },
    handleTransform(e: Konva.KonvaEventObject<Transform>) {
      this.connectionAnchorProps.scaleX = e.target.scaleX()
      this.connectionAnchorProps.scaleY = e.target.scaleY()
      this.connectionAnchorProps.x = e.target.x()
      this.connectionAnchorProps.y = e.target.y()
    },
    handleStageMouseClick(e: KonvaEventObject<MouseEvent>) {
      // если кликнули по сцене, очистить выбор
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = '';
        this.updateTransformer();
        return;
      }
      
      this.connectionAnchorProps.x = e.target.x()
      this.connectionAnchorProps.y = e.target.y()

      // если кликнули по трансформеру, ничего не делать
      const clickedOnTransformer =
        e.target.getParent()?.className === 'Transformer';
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

      console.log(selectedNode?.attrs)

      transformerNode.rotateAnchorOffset(35);
      transformerNode.anchorCornerRadius(3);
      transformerNode.rotateLineVisible(false);
      transformerNode.padding(1);
      transformerNode.anchorStyleFunc(function(anchor: any) {
      if (anchor.hasName('rotater')) {
        anchor.fill('black');
        anchor.cornerRadius(anchor.width() / 2);
        anchor.stroke('black')
      }
      if (anchor.hasName('top-center') || anchor.hasName('bottom-center')) {

      }
      if (anchor.hasName('middle-left') || anchor.hasName('middle-right')) {

      }
      });

      if (selectedNode) {
        transformerNode.nodes([selectedNode]);
        this.isNodeEditiong = true;
      } else {
        transformerNode.nodes([]);
        this.isNodeEditiong = false;
      }
    },
    addShape(shapeType: string) {
      const stage = (this.$refs.stage as Konva.Stage).getStage();
      this.isCreatingActive = true;
      this.currentShapeType = shapeType;

      let newItem: Item; // Определяем переменную здесь

      const clickHandler = (e: KonvaEventObject<MouseEvent>) => {
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
                stroke: Konva.Util.getRandomColor(),
                strokeWidth: 4,
                draggable: true,
                name: `node-${this.items.length}`,
                shapeType: 'circle',
                strokeScaleEnabled: false
              };
              break;
            case 'square':
              newItem = {
                x: pos.x,
                y: pos.y,
                offsetX: 50,
                offsetY: 50,
                rotation: 0,
                width: 100,
                height: 100,
                scaleX: 1,
                scaleY: 1,
                id: `node-${this.items.length}`,
                text: 'test',
                stroke: Konva.Util.getRandomColor(),
                strokeWidth: 4,
                draggable: true,
                name: `node-${this.items.length}`,
                shapeType: 'square',
                strokeScaleEnabled: false
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
                stroke: Konva.Util.getRandomColor(),
                draggable: true,
                name: `node-${this.items.length}`,
                shapeType: 'triangle',
                strokeScaleEnabled: false
              };
              break;
            default:
              break;
          }

          if (newItem) { // Проверяем, определена ли newItem
            this.items.push(newItem);
            stage.off('click');
            stage.on('click', (e) => this.handleStageMouseClick(e));
            this.isCreatingActive = false;
          }
        }
      };
      stage.on('click', clickHandler);
    },
    addCircle() {
      this.addShape('circle');
    },
    addSquare() {
      this.addShape('square');
    },
    addTriangle() {
      this.addShape('triangle');
    },
    handleStageWheel(e: { evt: { deltaY: number; }; }) {
      // определить направление прокрутки
      const delta = e.evt.deltaY;
      const stage = (this.$refs.stage as Konva.Stage).getStage();

      // масштабировать сцену
      const scaleBy = 1.1;
      const oldScale = stage.scaleX();

      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) {
          return; // Если позиция не определена, прерываем выполнение функции
      }

      const mousePointTo = {
        x: pointerPosition.x / oldScale - stage.x() / oldScale,
        y: pointerPosition.y / oldScale - stage.y() / oldScale,
      };

      const newScale = delta > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x:
          -(mousePointTo.x - pointerPosition.x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - pointerPosition.y / newScale) *
          newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
      this.stageScale = newScale; // сохранить текущий масштаб
    },
    openContext(e: { evt: MouseEvent, target: Object }) {
      if (e.evt instanceof MouseEvent) {
        e.evt.preventDefault();
      }
      this.showContextMenu = true;
      this.selectedShape = e.target
      this.mouseClickX = e.evt.clientX
      this.mouseClickY = e.evt.clientY
    },
    deleteShape() {
      console.log("deleteShape")
      if(this.selectedShape instanceof Konva.Shape)
      this.selectedShape.destroy();
      this.updateTransformer();
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