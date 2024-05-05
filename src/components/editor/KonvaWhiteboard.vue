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
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
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
        <v-arrow
          v-for="line in connections"
          :key="line.id"
          :config="{
            stroke: 'black',
            points: line.points
          }"
        />
        <v-group 
          v-for="group in groups"
          :key="group.id"
          :config="group"
          @dragstart="handleDragstart"
          @dragend="handleDragend"
          @transformstart="handleTransformStart"
          @transformend="handleTransformEnd"
          @contextmenu="openContext($event)"
          @dragmove="updateSelectedNodeAttributs"
          @transform="updateSelectedNodeAttributs"
        >
          <component
          :is="getShapeComponent(group.item.shapeType)"
          :config="group.item"
          />
          <v-text
            v-if="group.text"
            :config="group.text"
          />
          <v-circle
          v-if="drawningLine"
          :id="connectionInput.sides.top.id"
          :x="connectionInput.sides.top.x"
          :y="connectionInput.sides.top.y"
          :config="connectionInput.config"
           />
          <v-circle
          :id="connectionInput.sides.right.id"
          :x="connectionInput.sides.right.x"
          :y="connectionInput.sides.right.y"
          v-if="drawningLine"
          :config="connectionInput.config"
          />
          <v-circle
          :id="connectionInput.sides.bottom.id"
          :x="connectionInput.sides.bottom.x"
          :y="connectionInput.sides.bottom.y"
          v-if="drawningLine"
          :config="connectionInput.config"
          />
          <v-circle
          :id="connectionInput.sides.left.id"
          :x="connectionInput.sides.left.x"
          :y="connectionInput.sides.left.y"
          v-if="drawningLine"
          :config="connectionInput.config"
          />
        </v-group>
        <v-transformer
          :config="transformerConfig"
          ref="transformer" 
         />
        <ConnectionAnchor
          v-if="isNodeEditing"
          :x="selectedNodeAttributs.x"
          :y="selectedNodeAttributs.y"
          :scaleX="selectedNodeAttributs.scaleX"
          :scaleY="selectedNodeAttributs.scaleY"
          :rotation="selectedNodeAttributs.rotation"
          :nodeId="selectedNodeAttributs.nodeId"
          @connectNodes="createConnection"
        />
      </v-layer>
    </v-stage>
    <Toolbar 
      @add-circle="addCircle"
      @add-square="addSquare"
      @add-triangle="addTriangle"
    />
    <FloatMenu 
      v-if="isNodeEditing && showFloatMenu"
      :targetX="selectedNodeAttributs.screenX"
      :targetY="selectedNodeAttributs.screenY"
      :scaleX="selectedNodeAttributs.scaleX"
      :scaleY="selectedNodeAttributs.scaleY"
      :rotation="selectedNodeAttributs.rotation"
      @changeStroke="changeStroke"
      @changeFill="changeFill"
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
import FloatMenu from "@/components/editor/FloatMenu.vue";
import { KonvaEventObject } from "konva/lib/Node";

const width = window.innerWidth;
const height = window.innerHeight;

interface ItemGroup {
  x: number
  y: number
  width: number
  height: number
  offsetX?: number
  offsetY?: number
  rotation: number
  scaleX: number
  scaleY: number
  id: string
  draggable: boolean
  name: string
  item: {
    shapeType: string,
    strokeScaleEnabled: false,
    fill?: string,
    stroke?: string,
    strokeWidth?: number,
    // Параметры, специфичные для разных фигур
    radius?: number,
    width?: number,
    height?: number,
    sides?: number, // для треугольников
  }
  text?:{
    text: string,
    fontSize: number,
    fontFamily?: string,
    fill?: string,
    width?: number,
    height?: number,
    padding: number,
    align: string,
    scaleX?: number,
    scaleY?: number
  }
}

interface Line {
  id: number,
  points: any[]
  fromId?: any,
  toId?: any

}

export default {
  components: {
    Toolbar,
    ContextMenu,
    ConnectionAnchor,
    FloatMenu
  },
  data() {
    return {
      groups: [] as ItemGroup[],
      dragItemId: null as string | null,
      configKonva: {
        width: width,
        height: height,
        draggable: true
      },
      bgGridConfig: {
        radius: 1,
        fill: '#333',
        listening: false
      },
      transformerConfig: {
        keepRatio: false,
        ignoreStroke: true,
        rotateLineVisible: false,
        padding: 5,
        rotateAnchorOffset: 35,
        anchorCornerRadius: 3
      },
      defaultParameters: {
        width: 100,
        height: 100,
        radius: 50
      },
      connectionInput: {
        sides:{
          top: {
            id: '',
            x: 0,
            y: 0,
          },
          right: {
            id: '',
            x: 0,
            y: 0,
          },
          bottom: {
            id: '',
            x: 0,
            y: 0,
          },
          left: {
            id: '',
            x: 0,
            y: 0,
          },
        },
        config: {
          radius: 7,
          fill: '#ddd',
          stroke: '#555',
          strokeWidth: 1,
          scaleX: 1,
          scaleY: 1,
        }
      },
      connections: [] as Line[],
      drawningLine: false,
      selectedGroupName: '',
      isCreatingActive: false,
      isNodeEditing: false,
      currentShapeType: '', // текущий тип фигуры для добавления
      gridSize: 20,
      gridColumns: Math.ceil(window.innerWidth / 20),
      gridRows: Math.ceil(window.innerHeight / 20),
      stageScale: 1, // Добавляем переменную для отслеживания масштаба
      showContextMenu: false,
      mouseClickX: 0,
      mouseClickY: 0,
      selectedShape: null as Konva.Shape | Object | null,
      showFloatMenu: false,
      selectedNodeAttributs: {
        x: 0,
        y: 0,
        screenX: 0,
        screenY: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        nodeId: ''
      }
    };
  },
  computed: {
  },
  methods: {
    createConnection(e: any, nodeId: any, offset: any) {
      this.drawningLine = true;
      this.configKonva.draggable = false;
      this.connections.push({
        id: Date.now(),
        points: [e.target.x() + offset, e.target.y()],
        fromId: nodeId
      });
    },
    handleMouseMove(e: any) {
      if (!this.drawningLine) {
        return;
      }
      const pos = e.target.getStage().getRelativePointerPosition()
      const lastLine = this.connections[this.connections.length - 1];
      lastLine.points = [lastLine.points[0], lastLine.points[1], pos.x, pos.y];

    },
    handleMouseUp(e: any) {
      if (!this.drawningLine) {
        return
      }
      if (!(e.target?.getParent() instanceof Konva.Group)) {
        this.connections.pop();
        this.drawningLine = false;
        return
      }
      this.drawningLine = false;

      const lastLine = this.connections[this.connections.length - 1];
      lastLine.toId = e.target.getParent().id()
      lastLine.points = [
        lastLine.points[0],
        lastLine.points[1],
        e.target.getParent().x(),
        e.target.getParent().y()
      ];
    },
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
      
      const name = e.target.name();

      const group = this.groups.find((i) => i.id === this.dragItemId);
      if (group) {
        const index = this.groups.indexOf(group);
        this.groups.splice(index, 1);
        this.groups.push(group);
      }
      this.showFloatMenu = false;
      if(this.selectedGroupName !== name) {
        this.selectedGroupName = name;
        this.updateTransformer();
      }
    },
    handleDragend(e: any) {
      this.dragItemId = null;
      this.showFloatMenu = true;
      this.updateSelectedNodeAttributs(e);
    },
    handleTransformStart(e: any) {
      this.showFloatMenu = false;
    },
    handleTransformEnd(e: any) {
      // обновить свойства элемента после трансформации
      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );
      if(group === undefined) return;
      group.x = e.target.x();
      group.y = e.target.y();
      group.rotation = e.target.rotation();
      group.scaleX = e.target.scaleX();
      group.scaleY = e.target.scaleY();

      this.showFloatMenu = true;
      this.updateSelectedNodeAttributs(e);
      this.updateTransformer();
    },
    handleStageMouseClick(e: any) {
      this.configKonva.draggable = true;
      
      // если кликнули по сцене, очистить выбор
      if (e.target === e.target.getStage()) {
        this.selectedGroupName = '';
        this.updateTransformer();
        return;
      }
      // если кликнули по трансформеру, ничего не делать
      const clickedOnTransformer =
        e.target.getParent()?.className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }
      
      const name = e.target.getParent().name();
      const group = this.groups.find((r) => r.name === name);
      if (group) {
        this.selectedGroupName = name;
      } else {
        this.selectedGroupName = '';
      }
      this.showFloatMenu = true;
      this.updateSelectedNodeAttributs(e);
      this.updateTransformer();
    },
    updateConnections(target: Konva.Group) {
      this.connections.forEach((conn) => {
        const fromGroup = this.groups.find(group => group.id === conn.fromId);
        const toGroup = this.groups.find(group => group.id === conn.toId);
        if (fromGroup && toGroup) {

          if(target.id() == fromGroup.id) {
            conn.points = [
              target.x() + fromGroup.width / 2,
              target.y(),
              conn.points[2],
              conn.points[3]
            ];
            return
          }
          if(target.id() == toGroup.id) {
            conn.points = [
              conn.points[0],
              conn.points[1],
              target.x() + fromGroup.width / 2,
              target.y()
            ];
            return
          }
        }
      });
    },
    updateSelectedNodeAttributs(e: any) {
      let target = e.target
      if(e.target.getParent() instanceof Konva.Group) {
        target = e.target.getParent()
      }

      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );
      this.selectedNodeAttributs = {
        screenX: e.evt.clientX,
        screenY: e.evt.clientY,
        x: target.x(),
        y: target.y(),
        scaleX: target.scaleX(),
        scaleY: target.scaleY(),
        rotation: target.rotation(),
        nodeId: target.id()
      }

      this.updateConnections(target);

      this.connectionInput.config.scaleX = 1/Math.abs(target.scaleX())
      this.connectionInput.config.scaleY = 1/Math.abs(target.scaleX())

      if(group === undefined) return;
      if(!group.text) return
      group.text.scaleX = 1/Math.abs(target.scaleX())
      group.text.scaleY = 1/Math.abs(target.scaleY())
      group.text.width = this.defaultParameters.width * Math.abs(target.scaleX())
      group.text.height = this.defaultParameters.height * Math.abs(target.scaleY())
    },
    updateTransformer() {
      const transformerNode = (this.$refs.transformer as any).getNode();
      const stage = transformerNode.getStage();
      const { selectedGroupName } = this;
      const selectedGroup = stage.findOne('.' + selectedGroupName);

      if (selectedGroup === transformerNode.node()) {
        return;
      }
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

      if (selectedGroup) {
        transformerNode.nodes([selectedGroup]);
        this.isNodeEditing = true;
      } else {
        transformerNode.nodes([]);
        this.isNodeEditing = false;
      }
    },
    addShape(shapeType: string) {
      const stage = (this.$refs.stage as Konva.Stage).getStage();
      this.isCreatingActive = true;
      this.currentShapeType = shapeType;

      let newGroup: ItemGroup; // Определяем переменную здесь

      const clickHandler = (e: KonvaEventObject<MouseEvent>) => {
        const pos = stage.getRelativePointerPosition();
        if (pos) {
          switch (shapeType) {
            case 'circle':
              newGroup = {
                x: pos.x,
                y: pos.y,
                width: this.defaultParameters.width,
                height: this.defaultParameters.height,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                id: `node-${this.groups.length}`,
                draggable: true,
                name: `node-${this.groups.length}`,
                item:{
                  stroke: '#212121',
                  strokeWidth: 4,
                  radius: this.defaultParameters.radius,
                  shapeType: 'circle',
                  strokeScaleEnabled: false
                }
              };
              break;
            case 'square':
            newGroup = {
                x: pos.x,
                y: pos.y,
                width: this.defaultParameters.width,
                height: this.defaultParameters.height,
                offsetX: 50,
                offsetY: 50,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                id: `node-${this.groups.length}`,
                draggable: true,
                name: `node-${this.groups.length}`,
                item:{
                  width: this.defaultParameters.width,
                  height: this.defaultParameters.height,
                  stroke: '#212121',
                  strokeWidth: 4,
                  shapeType: 'square',
                  strokeScaleEnabled: false
                },
                text: {
                  text: 'texttexttexttexttexttexttexttexttexttexttexttexttexttext',
                  fontSize: 18,
                  fontFamily: 'Calibri',
                  fill: '#555',
                  width: 100,
                  height: 100,
                  padding: 20,
                  align: 'center',
                }
              };
              break;
            case 'triangle':
            newGroup = {
                x: pos.x,
                y: pos.y,
                width: this.defaultParameters.width,
                height: this.defaultParameters.height,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                id: `node-${this.groups.length}`,
                draggable: true,
                name: `node-${this.groups.length}`,
                item:{
                  stroke: '#212121',
                  strokeWidth: 4,
                  sides: 3,
                  radius: this.defaultParameters.radius,
                  shapeType: 'triangle',
                  strokeScaleEnabled: false
                }
              };
              break;
            default:
              break;
          }

          if (newGroup) { // Проверяем, определена ли newItem
            this.groups.push(newGroup);
            stage.off('click');
            stage.on('click', (e) => this.handleStageMouseClick(e));
            this.isCreatingActive = false;
          }

          for (const [key, value] of Object.entries(this.connectionInput.sides)) {
            value.id = `connectionInput-${key}-${this.groups.length}`
            if(shapeType === 'square') {
              value.x = newGroup.width/2
              value.y = newGroup.height/2
            }
          }
          this.connectionInput.sides.top.y -= (newGroup.item.radius ? newGroup.item.radius : newGroup.height/2) * newGroup.scaleY
          this.connectionInput.sides.right.x += (newGroup.item.radius ? newGroup.item.radius : newGroup.width/2) * newGroup.scaleX
          this.connectionInput.sides.bottom.y += (newGroup.item.radius ? newGroup.item.radius : newGroup.height/2) * newGroup.scaleY
          this.connectionInput.sides.left.x -= (newGroup.item.radius ? newGroup.item.radius : newGroup.width/2) * newGroup.scaleX
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
    changeFill(color: string) {
      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );
      if(group === undefined) return;
      group.item.fill = color
    },
    changeStroke(color: string) {
      const group = this.groups.find(
        (r) => r.name === this.selectedGroupName
      );
      if(group === undefined) return;
      group.item.stroke = color
    },
    openContext(e: any) {
      if (e.evt instanceof MouseEvent) {
        e.evt.preventDefault();
      }
      this.showContextMenu = true;
      if(e.target.getParent()){
        this.selectedShape = e.target.getParent()
      } else {
        this.selectedShape = e.target
      }
      this.mouseClickX = e.evt.clientX
      this.mouseClickY = e.evt.clientY
    },
    deleteShape() {
      console.log("deleteShape")
      if(this.selectedShape instanceof Konva.Group)
      this.selectedShape.destroy();
      this.updateTransformer();
    }
  },
  mounted() {
    this.groups = []; // Изменить начальные значения или оставить пустым
  },
};

</script>

<style scoped>
.createItem {
  cursor: crosshair;
}
</style>